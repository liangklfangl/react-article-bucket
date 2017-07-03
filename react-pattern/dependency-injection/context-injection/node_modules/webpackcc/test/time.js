let moduleStartTime = getCurrentSeconds();
function getCurrentSeconds() {
    return Math.round(new Date().getTime() / 1000);
    // return new Date().getTime() / 1000;
}
export function getElapsedSeconds() {
    return getCurrentSeconds() - moduleStartTime;
}
// Activate Webpack HMR
if (module.hot) {
    const data = module.hot.data || {};
    // Update our moduleStartTime if we are in the process of reloading
    if (data.moduleStartTime)
        moduleStartTime = data.moduleStartTime;
    // dispose handler to pass our moduleStart time to the next version of our module
    // 首次进入我们把当前时间保存到moduleStartTime中以后就可以直接访问
    module.hot.dispose((data) => {
        data.moduleStartTime = moduleStartTime;
    });
}
