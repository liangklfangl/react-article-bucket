import React from "react";
import { Table, Pagination, Form } from "antd";
import { fetchGet } from "xxxxx";
// fetchGet方法
import { eventProxy } from "../Utils/EventProxy";
import evalJSX from "./parser/evalJSX";
import { deserialize, reflectJSXRender } from "./utils";
const styles = require("./index.less");
const PAGE_SIZE = 10;
const REGREX = /(([^{}]*)return[\s]*)(<([a-z]+)([^<]+)?>[\s\S]*?<\/\4>)([\s\S])*?(?=})/g;
/**
 * 1.函数字符串如何注入到Table组件的column属性
 */
class TablePagination extends React.Component {
  constructor(props) {
    super(props);
    const localProps = [];
    const tablePaginationSchema = this.props.schema;
    const match = tablePaginationSchema.replace(REGREX, function(
      match,
      $1,
      $2,
      $3
    ) {
      localProps.push($2);
      return $1 + JSON.stringify(evalJSX($3));
    });
    let evalArray = deserialize(match);
    console.log("替换后的值为:", match, evalArray);
    // string->object
    const jsxRender = reflectJSXRender(evalArray.fields, localProps);
    // object->jsx
    this.renderString = tablePaginationSchema;
    this.state = {
      dialogVisible: false,
      ...evalArray,
      fields: jsxRender,
      total: 0,
      current: 1,
      dataSource: [{ name: "x" }]
    };
  }
  /**
   * 页码变换
   */
  pageNoChange = pageNo => {
    this.queryData({
      pageNo
    });
  };

  /**
   * 查询数据
   */
  queryData = (params = {}) => {
    const { fields = {}, layout = {}, extra = {} } = this.state;
    const { table, inEvents } = extra || {};
    const { url } = table;
    if (!params.pageSize) {
      params.pageSize = PAGE_SIZE;
    }
    if (!params.pageNo) {
      params.pageNo = this.state.current;
    }
    fetchGet(url, params).then(res => {
      const { success, data } = res;
      if (success) {
        const { itemList, total } = data;
      }
    });
  };

  componentWillReceiveProps(nextProps) {
    const localProps = [];
    const tablePaginationSchema = nextProps.schema;
    const match = tablePaginationSchema.replace(REGREX, function(
      match,
      $1,
      $2,
      $3
    ) {
      localProps.push($2);
      return $1 + JSON.stringify(evalJSX($3));
    });
    let evalArray = deserialize(match);
    console.log("替换后的值为:", match, evalArray);
    // string->object
    const jsxRender = reflectJSXRender(evalArray.fields, localProps);
    // object->jsx
    this.renderString = tablePaginationSchema;
    this.state = {
      dialogVisible: false,
      ...evalArray,
      fields: jsxRender,
      total: 0,
      current: 1,
      dataSource: [{ name: "x" }]
    };
  }

  /**
   * 挂载请求接口
   */
  componentDidMount() {
    const { fields = {}, layout = {}, extra = {} } = this.state;
    const { table, inEvents } = extra || {};
    const { url } = table;
    this.queryData();
    for (let t = 0, len = inEvents.length; t < len; t++) {
      const { type: eventType } = inEvents[t];
      // 接受内部事件
      switch (eventType) {
        case "tp.query": {
          // Query:编辑弹窗保存后调用，此时无需参数;点击搜索按钮的时候调用，此时无需参数
          eventProxy.on(eventType, () => {
            const { form } = this.props;
            const searchFormValue = form.getFieldsValue();
            const fieldsValue = Object.keys(
              searchFormValue
            ).reduce((prev, cur) => {
              if (searchFormValue[cur]) {
                prev[cur] = searchFormValue[cur];
              }
              return prev;
            }, {});
            console.log("tp组件发出的请求参数为:", fieldsValue);
            this.queryData({ ...fieldsValue });
          });
        }
        default: {
        }
      }
    }
  }

  render() {
    const { fields = {}, layout = {}, extra = {} } = this.state;
    const { table, pagination } = extra || {};
    const { url } = table || {};
    console.log("TablePagination中的数据为:", this.state);
    //不能支持jsx的{}迭代法
    return (
      <div className={styles.tablePaginationBox} {...layout}>
        <Table
          style={{ width: "100%" }}
          rowKey={"id"}
          dataSource={this.state.dataSource}
          pagination={{
            ...pagination,
            total: this.state.total,
            onChange: this.pageNoChange,
            current: this.state.current
          }}
          columns={this.state.fields}
        />
      </div>
    );
  }
}

export default Form.create()(TablePagination);
