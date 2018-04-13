
/**
 * Resource information metadata
 */
const ResourceInfoMetadata: Symbol = Symbol('esx-rs:resource');

/**
 * Resource information
 */
interface ResourceInfo {

}

/**
 * Get resource information
 * @param resourceClass Resource class
 * @param <T>           Resource type
 * @return Resource information
 */
function getResourceInfo<C extends Function>(target: C): ResourceInfo {
    let resourceInfo: ResourceInfo = Reflect.getMetadata(ResourceInfoMetadata, target);
    return resourceInfo;
}

/**
 * Set resource information
 * @param resourceClass Resource class
 * @param resourceInfo  Resource information
 * @param <C>           Resource type
 */
function setResourceInfo<C extends Function>(target: C, resourceInfo: ResourceInfo): void {
    Reflect.defineMetadata(ResourceInfoMetadata, resourceInfo, target);
}

export {
    ResourceInfo,
    getResourceInfo,
    setResourceInfo
};
