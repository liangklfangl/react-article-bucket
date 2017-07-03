export default {
  handlers:[],
  data: {},
  //用于注册data发生变化后重新渲染的回调函数
  onChange(callback){
    this.handlers.push(callback);
  },
  get(key) {
    return this.data[key];
  },
  //往应用的data中注入新的数据并要求顶层组件重新渲染
  register(key, value) {
    this.data[key] = value;
    this.handlers.forEach((handler) =>{
      handler();
    });
  }
};
