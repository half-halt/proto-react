import fauna from 'faunadb';
const { If, Function, Exists, Update, CreateFunction } = fauna.query;

export function createOrUpdateFunction(functionInfo) {	
	const udf = Function(functionInfo.name);
	return If(
		Exists(udf),
		Update(udf, { body: functionInfo.body, role: functionInfo.role }),
		CreateFunction({ name: functionInfo.name, body: functionInfo.body, role: functionInfo.role })
	);
}