const xlsx = require('node-xlsx');

const loadExcel = (path) => {
  return xlsx.parse(path);
};

const getFirstSheet = (sheets) => {
  return sheets[0].data;
};

module.exports = {
  loadExcel,
  getFirstSheet,
};


//选择一个文件上传
//服务端得到文件返回key
//前端再请求对应的业务