import Vue from 'vue'

//table 高度自适应
export let resize_ = resize.bind(Vue);

function resize(that, params, height) {
    window.addEventListener('resize', _ => {
        that[params] = Vue.prototype.tableHeight - height;
    });
}