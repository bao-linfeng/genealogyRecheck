<template>
    <div class="dragable" ref="dragElement" @mousedown="onMouseDown">
        <slot></slot>
    </div>
</template>

<script>
import api from "../api.js";
import ADS from "../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "drag",
    props:{
        
    },
    components: {

    },
    data: () => {
        return {
            dragElement: '',
            distanceX: 0,
            distanceY: 0,
        };
    },
    mounted:function(){
        this.dragElement = this.$refs.dragElement;
    },
    methods:{
        onMouseDown(e) {
            // 获取起始鼠标位置相对于容器的坐标
            const startX = e.clientX;
            const startY = e.clientY;

            // 添加mousemove和mouseup事件监听器
            document.addEventListener('mousemove', this.onMouseMove);
            document.addEventListener('mouseup', this.onMouseUp);

            // 记录起始鼠标位置和元素位置的距离
            this.distanceX = this.dragElement.offsetLeft - startX;
            this.distanceY = this.dragElement.offsetTop - startY;

            // 阻止默认行为
            e.preventDefault();                                 
        },
        onMouseMove(e) {
            // 计算元素的新位置
            const x = e.clientX  + this.distanceX;
            const y = e.clientY + this.distanceY;

            // 设置元素的新位置
            this.dragElement.style.left = x + 'px';
            this.dragElement.style.top = y + 'px';

            // 阻止默认行为
            e.preventDefault();
        },
        onMouseUp(e) {
            // 移除事件监听器
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);

            // 阻止默认行为
            e.preventDefault();
        },
    },
    computed: {
        ...mapState({
            stationKey: state => state.nav.stationKey,
            stationName: state => state.nav.stationName,
            stationlogo: state => state.nav.stationlogo,
            userId: state => state.nav.userId,
        })
    },
};
</script>

<style scoped lang="scss">
.dragable{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    height: calc(100% - 20px);
    z-index: 100;
}
</style>

