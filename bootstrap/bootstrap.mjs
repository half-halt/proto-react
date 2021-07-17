import fauna from 'faunadb';
import dotenv from 'dotenv';
import path from 'path';
import chalk from 'chalk';
import albums from './trainer/bootstrap.mjs';
import roles from './roles.mjs';
import { createIndex, createOrUpdateFunction } from "./core/index.mjs";
const { Update, If, Collection, Exists, CreateCollection, Role, Query, Lambda, CreateRole } = fauna.query;

dotenv.config({
	path: path.resolve("../.env")
});

async function executeOneOperator(client, item, expr) {
	const opName = chalk.cyanBright(`${item.type}: ${item.name}`) || chalk.yellow('<unknown>');
	let result = chalk.greenBright('SUCCESS');

	return await client.query(expr).then(
		(r) => {
			console.log('%s :: %s [%s]', opName, result, chalk.white(r.ref || r));
		},
		(error) => {
			result = chalk.redBright('ERROR [' + error.message + ']');
			console.log('%s :: %s', opName, result);
			console.dir(error);
		}
	)
}

const actions = {
	index: createIndex,
	function: createOrUpdateFunction,
	collection: (item) => {
		return If(
			Exists(Collection(item.name)),
			Collection(item.name),
			CreateCollection({ name: item.name })
		)
	},
	role: (item) => If(
		Exists(Role(item.name)),
		Update(Role(item.name), { membership: item.membership, privileges: item.privileges }),
		CreateRole({ name: item.name, membership: item.membership, privileges: item.privileges })
	)
	
}

const targets = {
	roles,
	albums,
}

const args = ['albums'];
const complete = {};
const client = new fauna.Client({ secret: process.env.FAUNA_ADMIN_SECRET });

function executeBootstrap(bootstrap) {
	return new Promise(
		async (resolve, reject) => {
			console.group(chalk.yellowBright(bootstrap.name))

			function executeItems() {
				let index = 0;
				function next() {
					if (!Array.isArray(bootstrap.items)) {
						return false;
					}

					if (index >= bootstrap.items.length) {
						return false;
					}

					const item = bootstrap.items[index++];
					try {
						const expr = actions[item.type](item);

						executeOneOperator(client, item, expr).then(
							() => { 
								if (!next()) {
									console.groupEnd();
									console.log(chalk.yellowBright(`${bootstrap.name} Complete.\n`));
									complete[bootstrap.name] = true;
									resolve(true);
								}
							},
							reject,
						);
				
						return true;
					} catch (error) {
						console.log("error", item);
						console.dir(error);
						reject(error);
						return false;
					}
				}

				if (!next()) {
					resolve(true);
				}
			}

			if (Array.isArray(bootstrap.depends)) {

				let depIndex = 0;

				function nextDepend() {
					if (depIndex >= bootstrap.depends.length) {
						executeItems();
					} else {
						const dependName = bootstrap.depends[depIndex++];
						const dependInfo = targets[dependName];
						if (!dependInfo) {
							reject(new Error('invalid dependnecy'));
						} else {
							executeBootstrap(dependInfo).then(
								() => nextDepend(),
								reject
							)
						}
					}
				}

				nextDepend();
			} else {
				executeItems();
			}
		});
}

args.forEach(async (arg) => {
	const bootstrap = targets[arg];
	if (!arg) {
		throw new Error("help");
	}

	await executeBootstrap(bootstrap);
})
