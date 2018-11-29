// XMTI3MDE2ODA0OA==
// 跳转发现页第一种情况
// XMTAzMDEzODcy(电影不勾选);XMTM2NjY4MDMy(时尚勾选)
// 跳转发现页第二种情况

var str = `'use strict';
const root = {
"policyType": "AND",
"itemList": [{
  "id": "104",
  "operate": "CONTAIN",
  "data": "{%"normal%":%"正常%",%"limited%":%"分级%"}",
  "_key": 5903275049170043,
  "title": "节目状态",
  "count": "47,013"
}],
"groupList": [{
  "policyType": "OR",
  "itemList": [{
    "id": "99",
    "operate": "CONTAIN",
    "data": "{%"预告片%":%"预告片%",%"正片%":%"正片%"}",
    "_key": 8121800120251998,
    "title": "包含视频类型",
    "count": "6,446"
  }, {
    "id": "11",
    "operate": "CONTAIN",
    "data": "{%"public%":%"公共版权%",%"authorized%":%"已授权%"}",
    "_key": 8263315177187782,
    "title": "版权状态",
    "count": "8,388"
  }]
}, {
  "policyType": "OR",
  "itemList": [{
    "id": "10",
    "operate": "CONTAIN",
    "data": "{%"11366%":%"刘德华%"}",
    "_key": 6073338655784541,
    "title": "演员",
    "count": "43"
  }, {
    "id": "49",
    "operate": "CONTAIN",
    "data": "{%"30730%":%"王家卫%"}",
    "_key": 8042493120227814,
    "title": "监制",
    "count": "2"
  }]
}]

};function onSave(newRelationship) {
console.log('保存的时候给我一个relationship', newRelationship);
}

function onEdit(individualRule) {
console.log('传递出去的单条特征的数据为', individualRule);
}
class Test extends React.Component {
render() {
  return <RelationTransformation onEdit={onEdit} isCoupling={false} onSave={onSave} data={root} />;
}
}
ReactDOM.render(<Test />, document.getElementById('app'));
window.RelationTransformation = RelationTransformation;`;
var hell = str.replace(/%["'](\S*?)%["']/g,function(value,capture){
    console.log('capture==',capture);
    return `"\\${capture}\\"`
});
console.log('替换后卫诶==',hell);