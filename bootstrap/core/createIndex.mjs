import fauna from 'faunadb';
const { If, Index, Exists, CreateIndex } = fauna.query;

export function createIndex(index) {
	const copy = Object.assign({}, index);
	delete copy.type;

	return If(
		Exists(Index(index.name)),
		Index(index.name),
		CreateIndex(index)
	);
}

export function allowReadIndex(index) {
	return {
		resource: Index(index),
		actions: { read: true }
	};
}