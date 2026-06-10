'use strict';
const db=uniCloud.database()
exports.main = async (event, context) => {
	let res=await db.collection("uni-id-users").get();
	return res
};
