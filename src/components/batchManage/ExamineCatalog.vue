<template>
    <div class="examine-wrap">
        <div class="head-box">
            <h3 class="title">编目待议审核</h3>
            <img class="close" @click="close(false)" src="../../assets/close.svg" alt="">
        </div>
        <div class="content-box">
            <h3 class="title">{{detail.genealogyName}}({{detail._key}})</h3>
            <p class="title">谱状态更新<i class="red">*</i></p>
            <el-radio-group v-model="canTake">
                <el-radio v-for="item in canTakeList" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
            <p class="title" v-if="canTake == 3">补充资料<i class="red">*</i></p>
            <el-checkbox v-if="canTake == 3" v-model="needFill" label="补充字段" />
            <el-checkbox v-if="canTake == 3" v-model="needImage" label="补充影像" />
            <div class="needFill-wrap marginT10" v-if="canTake == 3 && needFill" >
                <vxe-select v-model="needFillFields" placeholder="补充字段" multiple>
                    <vxe-option v-for="(item,index) in field_main" :key="index" :value="item.fieldMeans" :label="item.fieldMeans"></vxe-option>
                </vxe-select>
                <el-input class="marginT10" v-model="remark" placeholder="备注"></el-input>
            </div>
            
            <!-- <p class="title" v-if="!canTake">重复谱ID<i class="red">*</i></p>
            <el-input
                v-if="!canTake"
                placeholder="重复谱ID"
                v-model="Dupbookid">
            </el-input>
            <p class="title">审核说明<i class="red">*</i></p>
            <el-input
                type="textarea"
                :rows="3"
                placeholder="此处填写谱状态更改说明信息"
                v-model="verifyExplain">
            </el-input> -->
        </div>
        <div class="foot-box">
            <el-button type="primary" size="medium" @click="save">保存</el-button>
        </div>
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import DragModule from '../../components/dragModule/DragModule.vue';
import { mapState, mapActions, mapGetters } from "vuex";
export default {
    name: "examineCatalog",
    props:{
        detail: Object,
    },
    components: {
        DragModule, 
    },
    data: () => {
        return {
            conditionList: [
                // {'label': 'f|完结', 'value': 'f'}, 
                {'label': 'nf|可拍', 'value': 'nf'}, 
                {'label': 'm|待议', 'value': 'm'}, 
                {'label': 'd|重复', 'value': 'd'}, 
                {'label': 'r|无效', 'value': 'r'}
            ],
            condition: '',
            verifyExplain: '',
            Dupbookid: '',
            canTake: '',
            canTakeList: [
                {'label': '重复', 'value': 0}, 
                {'label': '可拍', 'value': 1}, 
                {'label': '无效', 'value': 2},
                {'label': '待议', 'value': 3}
            ],
            needFill: '',
            needImage: '',
            needFillFields: [],
            remark: '',
            field_main: [],
        };
    },
    created:function(){
        this.field_main = [
            {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
            {'fieldMeans': '姓氏', 'fieldName': 'surname'},
            {'fieldMeans': '出版年', 'fieldName': 'publish'},
            {'fieldMeans': '堂号', 'fieldName': 'hall'},

            {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor'},
            {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
            {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place'},
            {'fieldMeans': '谱籍地(原籍)', 'fieldName': 'LocalityModern'},
            {'fieldMeans': '总卷数', 'fieldName': 'volume'},
            {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
            {'fieldMeans': '可拍卷数', 'fieldName': 'hasVolume'},
            {'fieldMeans': '作者', 'fieldName': 'authors'},
            {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
            {'fieldMeans': '版本类型', 'fieldName': 'version'},
            {'fieldMeans': '重复谱ID', 'fieldName': 'Dupbookid'},
            {'fieldMeans': '备注', 'fieldName': 'memo'},
            {'fieldMeans': '说明', 'fieldName': 'explain'},
            // {'fieldMeans': '谱状态', 'fieldName': 'condition'},
            {'fieldMeans': '档案时间', 'fieldName': 'Filetimes'},
            {'fieldMeans': '档案名称', 'fieldName': 'Filenames'},
            {'fieldMeans': '姓氏2', 'fieldName': 'surname2'},
            {'fieldMeans': '姓氏3', 'fieldName': 'surname3'},
        ];
    },
    mounted:function(){
        if(!this.detail.canTake){
            this.canTake = 0;
        }
        if(this.detail.canTake == 1 || this.detail.hasIn == '是'){
            this.canTake = 1;
        }
        if(this.detail.canTake == 2){
            this.canTake = 2;
        }
        if(this.detail.canTake == 3){
            this.canTake = 3;
        }
        // 补充资料
        this.needFill = this.detail.needFill ? true : false;
        this.needImage = this.detail.needImage ? true : false;
        console.log(this.canTake);
    },
    methods:{
        close(f){
            this.$emit('close', f);
        },
        async changeCanTake(){// 谱目状态标记
            if(this.detail.hasIn == '否'){
                this.changeLoading();
                let result = await api.patchAxios('data/status', {
                    'dataKey': this.detail._key, 
                    'canTake': this.canTake, 
                    'needFillFields': this.needFillFields,
                    'remark': this.remark,
                    'needFill': this.needFill ? 1 : '',
                    'needImage': this.needImage ? 1 : '',
                    'userKey': this.userId, 
                    'siteKey': this.stationKey,
                });
                this.changeLoading(false);
                if(result.status == 200){
                    // this.tableData.map((item)=>{
                    //     if(item._key == data.row._key){
                    //         item.canTake = data.status;
                    //         item.condition = data.status == 3 ? 'm' : data.status == 2 ? 'r' : data.status == 1 ? 'nf' : 'd';
                    //     }
                    //     if(item._key == data.row._key){
                    //         item[data.property] = item[data.property] ? '' : 1;
                    //     }
                    // });
                    this.$emit('close', {'_key': this.detail._key, 'canTake': this.canTake, 'needFill': this.needFill ? 1 : '', 'needImage': this.needImage ? 1 : ''});
                }else{
                    this.$XModal.message({ message: result.msg, status: 'warning' });
                }
            }else{
                this.$XModal.message({ message: '已入库，不允许修改', status: 'warning' });
            }
        },
        save(){
            this.changeCanTake();
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
.examine-wrap{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px 50px;
    min-width: 300px;
    background: #fff;
    box-shadow: 0 1px 4px #ddd;
    z-index: 100;
    .head-box{
        position: relative;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .close{
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            cursor: pointer;
        }
    }
}
.content-box{
    position: relative;
    .title{
        height: 40px;
        line-height: 40px;
        .red{
            color: #f00;
        }
    }
}
.foot-box{
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
}
.width200{
    width: 200px;
}
.marginL10{
    margin-right: 10px;
}
.marginT10{
    margin-top: 10px;
}
.examine-drag{
    width: 400px;
    height: 500px;
}
</style>

