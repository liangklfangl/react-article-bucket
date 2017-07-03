var Store = {
  _handlers: [],
  data:{},
  //指定函数句柄，用于当data的值发生变化以后被调用
  onChange: function(handler) {
    this._handlers.push(handler);
  },
  register: function(key,value) {
    this.data[key] = value;
    this._handlers.forEach(handler => handler())
  },
  get: function(key) {
    return this.data[key];
  }
};
export default Store;
