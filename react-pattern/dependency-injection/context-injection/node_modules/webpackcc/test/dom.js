import $ from 'jquery';
export function writeTextToElement(id, text) {
    $('#' + id).text(text);
}
if (module.hot) {
    module.hot.decline('jquery');
}
