import Ajax from './lib/core/Ajax'
import { bind, extend } from './lib/utils'

function createInstance(defaultConfig) {
  const context = new Ajax(defaultConfig)
  const instance = bind(Ajax.prototype.request, context)
  extend(instance, Ajax.prototype, context)
  extend(instance, context)
  return instance
}

const ajax = createInstance()

ajax.create = function create(instanceConfig) {
  return createInstance(instanceConfig)
}

export default ajax
