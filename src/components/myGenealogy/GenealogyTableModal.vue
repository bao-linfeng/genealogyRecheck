<template>  
    <div class="jiapu-table-modal" :class="{active: isFull}">
        <div class="jiapu-table-title">
            <div class="head-wrap">
                <h3 class="title">检索结果</h3>
            </div>
            <div>
                <el-button class="marginL10" type="primary" size="mini" @click="toggleFull">{{isFull ? '隐藏' : '显示'}}全屏</el-button>
                <!-- <el-button class="marginL10" type="primary" size="mini" @click="toggleColumn">{{visible ? '隐藏' : '显示'}} 操作列</el-button> -->
                <span>共检索出<i>{{total}}</i>部家谱</span>
            </div>
        </div>
        <div class="jiapu-vxe-wrap style3">
            <div class="jiapu-vxe-box">
                <el-table
                    :data="list"
                    :height="h"
                    border
                    style="width: 100%"
                    :cell-class-name="cellClassName"
                    @sort-change="sortChangeEvent"
                    @selection-change="handleSelectionChange">
                    <el-table-column fixed="left" type="selection" width="55" align="center" />
                    <el-table-column fixed="left" v-for="(item,index) in field_main" :prop="item.fieldName" :label="item.fieldMeans" :key="'main'+index" width="100" align="center"></el-table-column>
                    <el-table-column v-for="(item,index) in field_branch" :prop="item.fieldName" :label="item.fieldMeans" :key="'branch'+index" width="100" align="center"></el-table-column>
                    <el-table-column prop="memo" label="备注" width="150" align="center"></el-table-column>
                    <el-table-column prop="explain" label="说明" width="150" align="center"></el-table-column>
                    <el-table-column prop="claimOrgName" label="认领机构" width="100" align="center"></el-table-column>
                    <el-table-column prop="claimTimeO" label="认领时间" width="100" align="center"></el-table-column>
                    <el-table-column prop="condition" label="谱状态" width="130" align="center"></el-table-column>
                    <el-table-column prop="createTime" label="导入时间" width="120" align="center" sortable="custom"></el-table-column>
                    <el-table-column prop="Filetimes" label="档案时间" width="120" align="center" sortable="custom"></el-table-column>
                    <el-table-column prop="Filenames" label="档名" width="100" align="center"></el-table-column>
                    <el-table-column prop="bookId" label="谱书编号" width="100" align="center"></el-table-column>
                    <el-table-column prop="DGS" label="DGS号码" width="100" align="center"></el-table-column>
                    <el-table-column prop="genealogyGroupID" label="家谱群组ID" width="100" align="center"></el-table-column>
                    <el-table-column prop="updateUserName" label="更新人员" width="100" align="center"></el-table-column>
                    <el-table-column prop="GCOverO" label="编目状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="NoIndexO" label="索引状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="gcStatusO" label="谱书状态" width="100" align="center"></el-table-column>
                    <el-table-column prop="indexAssignO" label="索引分配" width="120" align="center"></el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作"
                        width="200"
                        align="center">
                        <template slot-scope="scope">
                            <button class="AdaiActionButton" @click="lookBook(scope.row)">详情</button>
                            <button class="AdaiActionButton" v-if="orgAdmin == 'admin' || (role >= 1 && role <= 3)" @click="editBook(scope.row)">编辑</button>
                            <button class="AdaiActionButton" v-if="scope.row.imageLink" @click="readBook(scope.row)">FS影像</button>
                            <button class="AdaiActionButton" v-if="scope.row.imageOriginal == 'pipeline'" @click="readBook(scope.row)">影像</button>
                            <button class="AdaiActionButton" v-if="!scope.row.imageLink && scope.row.imageOriginal != 'pipeline' && (scope.row.hasFileOrRemark || scope.row.remark || scope.row.needFillFields)" @click="showAnnex(scope.row)">附件</button>
                            <button class="AdaiActionButton disabled" v-if="!scope.row.imageLink && scope.row.imageOriginal != 'pipeline' && !scope.row.hasFileOrRemark && !scope.row.remark && !scope.row.needFillFields">影像</button>
                            <button class="AdaiActionButton" @click="lookLog(scope.row)">记录</button>
                            <button class="AdaiActionButton" v-if="(scope.row.condition == 'nf' || scope.row.condition == 'f') && ['9138241997', '9071165200'].indexOf(roleKey) > -1" @click="catalogPass(scope.row)">{{scope.row.condition == 'f' ? '反' : ''}}完结</button>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <vxe-table
                    border
                    resizable
                    stripe
                    highlight-hover-row
                    ref="xTable"
                    :height="h"
                    @checkbox-change = "checkboxChange"
                    @checkbox-all = "checkboxChange"
                    :row-class-name="rowClassName"  
                    :cell-class-name="cellClassName"
                    :sort-config="{trigger: 'cell', orders: ['desc', 'asc', 'auto'], remote: true}"
                    @sort-change="sortChangeEvent"
                    :align="'center'"
                    :data="list">
                    <vxe-table-colgroup title="家谱信息" fixed="left">
                        <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                        <vxe-table-column v-for="(item,index) in field_main" :key="'main'+index" :width=" item.fieldName == 'surname' ? 60 : 100" :field="item.fieldName" :title="item.fieldMeans"></vxe-table-column>
                    </vxe-table-colgroup>
                    <vxe-table-column v-for="(item,index) in field_branch" :key="'branch'+index" :width="100" :field="item.fieldName" :title="item.fieldMeans"></vxe-table-column>
                    <vxe-table-column field="memo" title="备注" width="150" show-overflow="title"></vxe-table-column>
                    <vxe-table-column field="explain" title="说明" width="150" show-overflow="title"></vxe-table-column>
                    <vxe-table-column field="claimOrgName" title="认领机构" width="100"></vxe-table-column>
                    <vxe-table-column field="claimTimeO" title="认领时间" width="100"></vxe-table-column>
                    <vxe-table-column field="condition" title="谱状态" width="100"></vxe-table-column>
                    <vxe-table-column field="createTimeO" title="导入时间" width="100" sort-by="createTime" sortable></vxe-table-column>
                    <vxe-table-column field="Filetimes" title="档案时间" width="100" sort-by="Filetimes" sortable></vxe-table-column>
                    <vxe-table-column field="Filenames" title="档名" width="100"></vxe-table-column>
                    <vxe-table-column field="bookId" title="谱书编号" width="100"></vxe-table-column>
                    <vxe-table-column field="DGS" title="DGS号码" width="100"></vxe-table-column>
                    <vxe-table-column field="genealogyGroupID" title="家谱群组ID" width="100"></vxe-table-column>
                    <vxe-table-column field="updateUserName" title="更新人员" width="100"></vxe-table-column>
                    <vxe-table-column field="GCOverO" title="编目状态" width="100"></vxe-table-column>
                    <vxe-table-column field="NoIndexO" title="索引状态" width="100"></vxe-table-column>
                    <vxe-table-column field="gcStatusO" title="谱书状态" width="100"></vxe-table-column>
                    <vxe-table-column title="操作" :visible="visible" fixed="right" :width="w" :cell-render="{name:'AdaiActionButton',attr:{data:actionButton},events:{'editBook':editBook, 'removeBook':removeBook,'readBook':readBook, 'lookBook': lookBook, 'catalogPass': catalogPass, 'lookLog': lookLog}}"></vxe-table-column>
                </vxe-table> -->
            </div>
        </div>
        <!-- 记录 -->
        <LogModule v-if="isLog == 1" :gid="gid" v-on:close="closeLog" />
        <!-- 谱目编辑 -->
        <Drag class="drag1">
            <EditCatalog class="edit-jiapu" v-if="(isLog == 2)" :read="isRead" :dataKey="gid" :conditionEdit="true" :vid="''" v-on:close="closeLog" />
        </Drag>
        <!-- 查看谱目 -->
        <CatalogView v-if="isLog == 3" :read="isRead" :dataKey="gid" :vid="''" v-on:close="closeLog" v-on:save="handleSave" />
        <!-- 谱目完结 -->
        <CatalogFinish v-if="isLog == 4" :dataKey="gid" v-on:close="isLog = 0" v-on:save="catalogFinishSave" />
        <!-- 附件 -->
        <AnnexModal v-if="isShowAnnex" :gid="gid" :row="annexRow" v-on:close-annex="isShowAnnex = false" />
    </div>
</template>

<script>
import api from "../../api.js";
import LogModule from '../../components/discussed/LogModule.vue';
import EditCatalog from '../../components/takeCamera/EditCatalog.vue';
import CatalogView from '../../components/takeCamera/CatalogView.vue';
import Drag from '../Drag.vue';
import CatalogFinish from './CatalogFinish.vue';
import { mapState, mapActions, mapGetters } from "vuex";
import ADS from "../../ADS";
import AnnexModal from "../QingTimeGenealogy/AnnexModal.vue";
export default {
    name: "genealogyTableModal",
    props:{
        list:{
            type: Array
        },
        total:{
            type: Number,
        },
    },
    components: {
        LogModule, EditCatalog, CatalogView, CatalogFinish, Drag, AnnexModal,
    },
    data: () => {
        return {
            gid: '',
            volume: 10,
            w: 300,
            actionButton: [
                {'label': '详情', 'value': 'lookBook'}, 
                {'label': '编辑', 'value': 'editBook'},
                {'label': '记录', 'value': 'lookLog'},
                {'label': '影像', 'value': 'readBook'},
                {'label': '完结', 'value': 'catalogPass'},
            ],
            isEdit: false,
            pumu:'',
            isShow: true,
            field_main: [],
            field_branch: [],
            isLog: 0,
            isRead: false,
            visible: true,
            h: 500,
            row: {},
            isFull: false,
            isShowAnnex: false,
            annexRow: {},
        };
    },
    created:function(){
        this.h = window.innerHeight - 60 - 195 - 50- 40 - 50;
        this.field_main = [
            {'fieldMeans': '文件标题', 'fieldName': 'fileName'},
            {'fieldMeans': '谱ID', 'fieldName': '_key'},
            {'fieldMeans': '谱名', 'fieldName': 'genealogyName'},
            {'fieldMeans': '姓氏', 'fieldName': 'surname'},
            {'fieldMeans': '出版年', 'fieldName': 'publish'},
            {'fieldMeans': '堂号', 'fieldName': 'hall'},
        ];

        this.field_branch = [
            {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor'},
            {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor'},
            {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place'},
            {'fieldMeans': '谱籍地(原谱)', 'fieldName': 'LocalityModern'},
            {'fieldMeans': '总卷数', 'fieldName': 'volume'},
            {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume'},
            {'fieldMeans': '可拍册数', 'fieldName': 'hasVolume'},
            {'fieldMeans': '实拍册数', 'fieldName': 'volumeNumber'},
            {'fieldMeans': '通过册数', 'fieldName': 'passVolumeNumber'},
            {'fieldMeans': '认领状态', 'fieldName': 'takeStatus'},
            {'fieldMeans': '作者', 'fieldName': 'authors'},
            {'fieldMeans': '作者职务', 'fieldName': 'authorJob'},
            {'fieldMeans': '版本类型', 'fieldName': 'version'},
            {'fieldMeans': '重复谱ID', 'fieldName': 'Dupbookid'},
            {'fieldMeans': '谱籍地(现代)2', 'fieldName': 'place2'},
            {'fieldMeans': '谱籍地(现代)3', 'fieldName': 'place3'},
        ];
    },
    mounted:function(){
        if(this.role < 1 || this.role > 3){
            if(this.orgAdmin == 'admin'){
                this.w = 240;
                this.actionButton = [
                    {'label': '详情', 'value': 'lookBook'}, 
                    {'label': '编辑', 'value': 'editBook'},
                    {'label': '记录', 'value': 'lookLog'},
                    {'label': '影像', 'value': 'readBook'},
                    // {'label': '完结', 'value': 'catalogPass'},
                ];
            }else{
                this.w = 180;
                this.actionButton = [
                    {'label': '详情', 'value': 'lookBook'}, 
                    {'label': '记录', 'value': 'lookLog'},
                    {'label': '影像', 'value': 'readBook'},
                ];
            }
        }else{
            // if(this.stationKey == '1379194999'){// 时光站
            //     this.w = 330;
            //     this.actionButton = [
            //         {'label': '详情', 'value': 'lookBook'}, 
            //         {'label': '编辑', 'value': 'editBook'},
            //         {'label': '影像', 'value': 'readBook'},
            //         {'label': '记录', 'value': 'lookLog'},
            //         {'label': '删除', 'value': 'removeBook'},
            //         {'label': '完结', 'value': 'catalogPass'},
            //     ];
            // }
        }
        
    },
    methods:{
        showAnnex(row){
            this.annexRow = row;
            this.gid = row._key;
            this.isShowAnnex = true;
        },
        toggleFull(){
            this.isFull = !this.isFull;
            if(this.isFull){
                this.h = this.h + 240;
            }else{
                this.h = this.h - 240;
            }
            this.$emit('toggle-full', this.isFull);
        },
        // sortChangeEvent({column, property, order, sortBy, sortList, $event}){
        //     console.log(property, order, sortBy);
        //     this.$emit('get-genealogy', {'prop': sortBy, 'order': order});
        // },
        sortChangeEvent({column, prop, order}){
            console.log(column, prop, order);
            this.$emit('get-genealogy', {'prop': prop || '', 'order': order === 'ascending' ? 'asc' : order === 'descending' ? 'desc' : ''});
        },
        cellClassName({ row, column, rowIndex, columnIndex }){
            if(row.changeFieldArr && row.changeFieldArr.indexOf(column.property) > -1){
                return 'row-blue';
            }
        },
        rowClassName ({ row, rowIndex }) {
            // return 'row-orange';
        },
        toggleColumn(){
            this.visible = !this.visible;
            this.$nextTick(() => {
                this.$refs.xTable.refreshColumn();
            });
        },
        handleSave(){

        },
        catalogFinishSave(){
            this.isLog = 0;
            this.$emit('get-genealogy','')
        },
        closeLog(f){
            this.isLog = 0;
            this.isRead = false;
            f ? this.$emit('get-genealogy','') : null;
        },
        lookLog(row){
            this.isLog = 1;
            this.gid = row._key;
        },
        closeEdit(flag){
            this.isEdit = false;
            this.isShow = true;
            flag ? this.$emit('get-genealogy','') : null;
        },
        handleSelectionChange(records){
            console.log(records);
            records.map((item)=>{
                item.select = true;
            });
            this.$emit('checkbox-change',records);
        },
        checkboxChange({records}){
            records.map((item)=>{
                item.select = true;
            });
            this.$emit('checkbox-change',records);
        },
        editBook(row){// 编辑谱目
            if((this.role >= 1 && this.role <= 3) || (this.orgAdmin == 'admin' && row.claimOrgKey == this.orgId)){
                this.gid = row._key;
                this.pumu = row;
                this.isEdit = true;
                this.isShow = false;
                this.isLog = 2;
                this.isRead = false;
            }else{
                ADS.message('您无权编辑!');
            }
        },
        lookBook(row){// 查看谱目
            this.gid = row._key;
            this.pumu = row;
            this.isEdit = true;
            this.isShow = true;
            this.isLog = 3;
            this.isRead = true;
        },
        catalogPass(row){
            if(row.condition == 'nf' || row.condition == 'f'){
                this.gid = row._key;
                this.isLog = 4;
            }else{
                this.$message({message: '该谱目目前状态不允许进行完结操作！', type: 'warning'});
            }
        },
        removeBook({row}){// 删除谱目或退出共享
            this.$confirm('此操作将永久'+(row.siteKey == this.stationKey ? '删除该谱目数据' : '退出分享')+',是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(row.siteKey == this.stationKey){
                    this.deleteGenealogy([row._key]);
                }else{
                    this.deleteShare(row._key);
                }
            }).catch(() => {});
        },
        deleteGenealogy:async function(checkList){//删除
            let data=await api.deleteAxios('catalog',{'catalogKeyArr':checkList, 'userKey':this.userId, 'siteKey':this.stationKey, 'orgKey': this.orgId});
            if(data.status == 200){
                this.$emit('get-genealogy','');
            }else{
                this.$message({message: '删除家谱出错，请重新删除',type: 'warning'});
            }
        },
        deleteShare:async function(gid){// 退出共享
            let data=await api.deleteAxios('catalog/exitShare',{'catalogKey':gid,'userKey':this.userId,'siteKey':this.stationKey});
            if(data.status == 200){
                this.$message({message: '退出共享成功',type: 'success'});
                this.$emit('get-genealogy','');
            }else{
                this.$message({message: '退出共享出错，请重新退出',type: 'warning'});
            }
        },
        readBook(row){// 阅读影像
            if(row.imageLink){
                window.open(row.imageLink);
            }else if(row.hasImageNew){
                window.open('/'+this.pathname+'/viewImage?gid='+row._key+'&genealogyName='+row.genealogyName);
                // window.open('/'+this.pathname+'/view?gid='+row._key+'&volume=1&page=1');
            }else{
                this.$XModal.message({ message: '暂时无法查看影像', status: 'warning' });
            }
        },
    },
    computed: {
        ...mapState({
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            role: state => state.nav.role,
            stationKey: state => state.nav.stationKey,
            orgId: state => state.nav.orgId,
            pathname: state => state.nav.pathname,
            orgAdmin: state => state.nav.orgAdmin,
            catalogStatusO: state => state.nav.catalogStatusO,
            isResize: state => state.nav.isResize,
            roleKey: state => state.nav.roleKey,
        })
    },
    watch: {
        'fieldFilters': function(nv, ov){
            this.initData();
        },
        'isResize': function(nv, ov){
            if(this.isFull){
                this.h = window.innerHeight - 60 - 195 - 50- 40 - 50 + 240;
            }else{
                this.h = window.innerHeight - 60 - 195 - 50- 40 - 50;
            }
        },
    },
};
</script>
<style scoped lang="scss">
.jiapu-table-modal{
    width: calc(100% - 40px);
    margin: 0 20px;
    background-color: #fff;
    .jiapu-table-title{
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
        .head-wrap{
            display: flex;
            align-items: center;
        }
        h3{
            color: #344B5A;
            height: 16px;
            line-height: 16px;
            border-left: 2px solid #4C95FF;
            padding-left: 20px;
        }
        span{
            color: #7E8E98;
            margin-right: 20px;
            margin-left: 10px;
            letter-spacing: 1px;
            i{
                font-style: normal;
                letter-spacing: 0px;
                margin: 0 5px;
            }
        }
    }
    .jiapu-vxe-wrap{
        position: relative;
        width: 100%;
        // overflow-x: auto;
        .jiapu-vxe-box{
            position: relative;
            width: 100%;
            // width: 3000px;
        }
    }
}
.marginL10{
    margin-left: 10px;
}
.row-blue{
    color: #358acd;
    font-weight: bold;
}
.edit-jiapu{
    top: 10px;
    bottom: 10px;
}
.drag1{
    height: 100% !important;
}
.disabled{
    background-color: #ddd;
}
</style>

