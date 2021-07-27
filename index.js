import Ajax from './lib/core/Ajax'

const ajax = Ajax()

ajax.create = function create(instanceConfig) {
  return Ajax(instanceConfig)
}

export default ajax
