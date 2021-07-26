import Ajax from './lib/core/Ajax'

function createInstance(defaultConfig) {
  return Ajax(defaultConfig)
}

const ajax = createInstance()

ajax.create = function create(instanceConfig) {
  return createInstance(instanceConfig)
}

export default ajax
