import {ResourceInfoMetadata} from './resource-info-metadata';

/**
 * Resource information
 */
interface ResourceInfo {

}

/**
 * Get resource information
 * @param resourceClass Class constructor
 * @param <T>           Class constructor type
 * @return Operation information
 */
function getResourceInfo<C extends Function>(resourceClass: C): ResourceInfo {
    let resourceInfo: ResourceInfo = Reflect.getMetadata(ResourceInfoMetadata, resourceClass);
    return resourceInfo;
}

export {
    ResourceInfo,
    getResourceInfo
};
