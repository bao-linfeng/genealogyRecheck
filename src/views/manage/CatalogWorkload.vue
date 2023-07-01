<template>  
    <div class="wrap">
        <Sidebar />
        <div class="box">
            <iframe src="https://jiapusupplier.qingtime.cn/catalogWorkloadSummary" frameborder="0"></iframe>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import Sidebar from "../../components/sidebar/Sidebar.vue";
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "catalogWorkload",
    components: {
        Sidebar,
    },
    data: () => {
        return {
            
        };
    },
    created:function(){
        
    },
    mounted:function(){

    },
    methods:{
        
    },
    computed: {
        ...mapState({
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            orgId: state => state.nav.orgId,
            orgAdmin: state => state.nav.orgAdmin,
        })
    },
    watch:{
        
    }
};
</script>
<style scoped lang="scss">
.wrap{
    position: relative;
    width: calc(100% - 200px);
    height: 100%;
    padding-left: 200px;
    text-align: left;
    .box{
        position: relative;
        width: 100%;
        height: 100%;
        background: #EFF1F5;
        overflow: hidden;
        iframe{
            width: 100%;
            height: 100%;
        }
    }
}
</style>

