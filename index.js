import createInstance from './lib/core/Ajax'

const ajax = createInstance()

ajax.create = function create(instanceConfig) {
  return createInstance(instanceConfig)
}

export default ajax
