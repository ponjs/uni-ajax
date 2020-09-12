import UniAjax from './lib/ajax';

function createInstance(defaultConfig) {
  return new UniAjax(defaultConfig).request;
}

const uniAjax = createInstance();

uniAjax.create = function create(instanceConfig) {
  return createInstance(instanceConfig);
};

export default uniAjax;
