<template>
    <!-- @keyup.stop="" -->
    <div class="catalog-edit-wrap" :class="{read: read}">
        <div class="head-box">
            <el-button type="primary" size="small" @click="handleOpenAutoCompleteSearch">地名搜索</el-button>
            <h3 class="title">谱目编辑</h3>
            <img class="close" @click="close(false)" src="../../assets/close.svg" alt="">
        </div>
        <div class="content-box" @mousedown.stop="">
            <ul class="edit-content">
                <li :class="{w100: item.w, marginL10: item.marginL10}" v-for="(item, index) in argumentsList" :key="index" v-show="!item.hide">
                    <label class="label" :class="{w105: ['place', 'place2', 'place3', 'LocalityModern'].indexOf(item.fieldName) > -1}">
                        <i>{{item.fieldMeans}}</i>
                        <div v-if="item.rule" class="tooltip">
                            <img class="title" @click="changeTooltip(item.fieldName)" src="../../assets/help.svg" />
                            <p :class="{active: item.tooltip}" v-show="tooltipShow == item.fieldName">{{item.rule}}</p>
                        </div>
                    </label>
                    <el-input v-if="['version'].indexOf(item.fieldName) == -1" class="w90" :class="{changeActive: changeFieldArrAll.indexOf(item.fieldName) > -1, w80: ['place'].indexOf(item.fieldName) > -1, w33: item.fieldName == 'surname'}" v-model="parameter[item.fieldName]" @focus="handleClickInput(item.fieldName)" :title="parameter[item.fieldName]" :clearable="item.clearable"  :disabled="item.disabled || read" size="medium"></el-input>
                    <el-input v-if="item.fieldName == 'surname'" class="w33" :class="{changeActive: changeFieldArrAll.indexOf('surname2') > -1}" v-model="parameter['surname2']" :title="parameter['surname2']"  :disabled="read" size="medium"></el-input>
                    <el-input v-if="item.fieldName == 'surname'" class="w33" :class="{changeActive: changeFieldArrAll.indexOf('surname3') > -1}" v-model="parameter['surname3']" :title="parameter['surname3']"  :disabled="read" size="medium"></el-input>
                    <el-select v-if="item.fieldName == 'version'" class="w90" v-model="parameter['version']" size="medium">
                        <el-option
                            v-for="item in versionList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <div v-if="item.fieldName == 'lostVolume'" class="lostVolume-ul" v-show="isShowlostVolume">
                        <p class="lostVolume-li" v-for="(item2, index2) in lostVolumeList" :key="index2" @click="changeLostVolume(item2)">{{item2.label}}</p>
                    </div>
                    <img class="edit" v-if="['place'].indexOf(item.fieldName) > -1 && isEdit" @click="isOpen = 2" title="更新" src="../../assets/shoot/leaveMsg.svg" alt="">
                </li>
                <li class="w100">
                    <label class="label" for="">
                        <i>备注</i>
                        <div class="tooltip">
                            <img class="title" @click="changeTooltip('memo')" src="../../assets/help.svg" />
                            <p :class="{active: true}" v-show="tooltipShow == 'memo'">必須要半型的標點符號</p>
                        </div>
                    </label>
                    <el-input
                        class="textarea"
                        :class="{changeActive: changeFieldArrAll.indexOf('memo') > -1}"
                        type="textarea"
                        :rows="2"
                        placeholder=""
                        :disabled="read"
                        v-model="parameter['memo']">
                    </el-input>
                </li>
                <li class="w100">
                    <label class="label" for="">
                        <i>说明</i>
                        <div class="tooltip">
                            <img class="title" @click="changeTooltip('explain')" src="../../assets/help.svg" />
                            <p :class="{active: true}" v-show="tooltipShow == 'explain'">必須要半型的標點符號</p>
                        </div>
                    </label>
                    <el-input
                        class="textarea h30"
                        :class="{changeActive: changeFieldArrAll.indexOf('explain') > -1}"
                        type="textarea"
                        :rows="2"
                        placeholder=""
                        :disabled="read"
                        v-model="parameter['explain']">
                    </el-input>
                </li>
                <li class="w100" v-if="conditionEdit">
                    <label class="label" for="">谱状态</label>
                    <el-select class="w80" v-model="parameter['condition']" :disabled="true" placeholder="谱状态" size="medium">
                        <el-option
                            v-for="item in conditionList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <img class="edit" v-if="role >= 1 && role <= 3 && isEdit" @click="isOpen = 3" title="更新状态" src="../../assets/shoot/leaveMsg.svg" alt="">
                </li>
                <li class="w100">
                    <label class="label" for="">所属国家</label>
                    <el-select class="w80" v-model="parameter['country']" placeholder="所属国家" size="medium">
                        <el-option
                            v-for="item in countryList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </li>
            </ul>
        </div>
        <div class="foot-box" v-if="!read && isEdit">
            <el-button size="medium" @click="close(false)">取消</el-button>
            <el-button type="primary" size="medium" @click="saveData">保存</el-button>
        </div>
        <!-- 谱籍地(现代)修改 -->
        <PlaceModule v-if="isOpen == 2" :address="parameter" v-on:close="isOpen = 0" v-on:save="savePlace" />
        <!-- 状态修改 -->
        <ConditionEdit v-if="isOpen == 3" :catalog="detail" v-on:close="isOpen = 0" v-on:save="saveCondition" />
    </div>
</template>

<script>
import api from "../../api.js";
import ADS from "../../ADS.js";
import { mapState, mapActions, mapGetters } from "vuex";
import PlaceModule from '../takeCamera/PlaceModule.vue';
import ConditionEdit from '../takeCamera/ConditionEdit.vue';
export default {
    name: "catalogView",
    components: {
        PlaceModule, ConditionEdit, 
    },
    props:{
        dataKey: String,
        read: Boolean,
        conditionEdit: {
            type: Boolean,
            default: false
        },
    },
    data: () => {
        return {
            argumentsList: [
                {'fieldMeans': '谱ID', 'fieldName': '_key', 'disabled': true,},
                {'fieldMeans': '姓氏', 'fieldName': 'surname', 'required': true, 'marginL10': 10, 'rule': '第1欄不可為空白，第2-3欄可以空白；提供三個欄位，每個欄位只能放一個姓氏，不可加“氏”，最多三個姓氏'},
                {'fieldMeans': '谱名', 'fieldName': 'genealogyName', 'tooltip': true, 'required': true,'clearable': true, 'w': '100%', 'rule': '可以放半型“.“”( )”，不可以有其他標點符號，不可有空格，可拆字（），不可有阿拉伯數字'},
                {'fieldMeans': '出版年', 'fieldName': 'publish', 'tooltip': true, 'required': true,'clearable': true, 'rule': '只能填入阿拉伯數字，不可加“年”'},
                {'fieldMeans': '堂号', 'fieldName': 'hall', 'required': true,'clearable': true, 'marginL10': 10, 'rule': '不可空白，如無堂號請填“無”'},
                {'fieldMeans': '一世祖', 'fieldName': 'firstAncestor', 'tooltip': true, 'clearable': true, 'rule': '只能放1個人的完整姓名（姓+名），不可有其他標點符號，除了拆字（）'},
                {'fieldMeans': '始迁祖', 'fieldName': 'migrationAncestor', 'clearable': true, 'marginL10': 10, 'rule': '只能放1個人的完整姓名（姓+名），不可有其他標點符號，除了拆字（）'},
                {'fieldMeans': '谱籍地(原谱)', 'fieldName': 'LocalityModern', 'tooltip': true, 'clearable': true, 'required': true, 'w': '100%', 'rule': '不同的行政區劃需用","分開，只能放文字，國字數字小寫，不可有空格,不可有其他標點符號,除了拆字（）'},
                {'fieldMeans': '谱籍地(现代)', 'fieldName': 'place', 'tooltip': true, 'clearable': true, 'required': true, 'w': '100%', 'rule': '不同的行政區劃需用","只能放文字，國字數字小寫, 分開只能錄入一個完整地名，含省份，市，縣，鄉/鎮/街道，如果有村可錄入；'},
                {'fieldMeans': '谱籍地(现代)2', 'fieldName': 'place2', 'tooltip': true, 'clearable': true, 'required': false, 'w': '100%', 'rule': '不同的行政區劃需用","只能放文字，國字數字小寫, 分開只能錄入一個完整地名，含省份，市，縣，鄉/鎮/街道，如果有村可錄入；'},
                {'fieldMeans': '谱籍地(现代)3', 'fieldName': 'place3', 'tooltip': true, 'clearable': true, 'required': false, 'w': '100%', 'rule': '不同的行政區劃需用","只能放文字，國字數字小寫, 分開只能錄入一個完整地名，含省份，市，縣，鄉/鎮/街道，如果有村可錄入；'},
                {'fieldMeans': '总卷数', 'fieldName': 'volume', 'tooltip': true, 'required': true, 'clearable': true, 'w': '100%', 'rule': '依照譜書目錄填入卷（冊）數，可以使用","，不可有空格，不分卷全____冊'},
                {'fieldMeans': '缺卷说明', 'fieldName': 'lostVolume', 'tooltip': true, 'clearable': true, 'w': '100%', 'required': true, 'rule': '提供錄入選單如下: 選項1：總卷數欄位如為總卷數不詳，填"存卷______________”；選項2：總卷數欄位如為不分卷且確定不全，填"存___冊”；選項3：不缺卷（冊）；選項4：知道總卷數且確定不全，則填“缺。。。”；選項5：其他（可自由填入資訊）只可以使用半型“,“~“，數字必須是阿拉伯數字，不可有空格；'},
                {'fieldMeans': '可拍册数', 'fieldName': 'hasVolume', 'tooltip': true, 'clearable': true, 'required': true, 'rule': '只要填阿拉伯數字，沒有文字'},
                {'fieldMeans': '实拍册数', 'fieldName': 'volumeNumber', 'marginL10': 10, 'disabled': true, 'rule': '只要填阿拉伯數字，沒有文字'},
                {'fieldMeans': '作者', 'fieldName': 'authors', 'tooltip': true, 'clearable': true, 'required': true, 'rule': '只能放1個人的完整姓名（姓+名）,除了拆字（），不可有其他標點符號；可寫不詳'},
                {'fieldMeans': '作者职务', 'fieldName': 'authorJob', 'clearable': true, 'marginL10': 10, 'required': true, 'rule': '只能放1個職務，不可有標點符號；可寫不詳'},
                {'fieldMeans': '版本类型', 'fieldName': 'version', 'clearable': true},
                {'fieldMeans': '重复谱ID', 'fieldName': 'Dupbookid', 'clearable': true, 'marginL10': 10, 'rule': '只能填譜ID，只要有資料就表示要關聯系統原有譜書ID'},
                {'fieldMeans': '谱书编号', 'fieldName': 'bookId', 'clearable': true},
                {'fieldMeans': 'DGS号码', 'fieldName': 'DGS', 'clearable': true, 'marginL10': 10},

                {'fieldMeans': '姓氏2', 'fieldName': 'surname2', 'hide': true},
                {'fieldMeans': '姓氏3', 'fieldName': 'surname3', 'hide': true},

                {'fieldMeans': '省', 'fieldName': 'prov', 'hide': true},
                {'fieldMeans': '市', 'fieldName': 'city', 'hide': true},
                {'fieldMeans': '区', 'fieldName': 'district', 'hide': true},
            ],
            GCOver: '',
            NoIndex: 0,
            parameter: {},
            detail: {},
            changeFieldArr: [],
            changeFieldArrAll: [],
            conditionList: [
                {'label': 'f', 'value': 'f'},
                {'label': 'nf', 'value': 'nf'},
                {'label': 'm', 'value': 'm'},
                {'label': 'r', 'value': 'r'},
                {'label': 'd', 'value': 'd'},
            ],
            isOpen: 0,
            isEdit: false,
            versionList: [
                {'label': '刊本', 'value': '刊本'}, 
                {'label': '写本', 'value': '写本'}
            ],
            lostVolumeList: [
                {'label': '不缺卷册', 'value': '0'}, 
                {'label': '总卷数不详', 'value': '存卷'}, 
                {'label': '不分卷且确定不全', 'value': '存  册'}, 
                {'label': '知道总卷数且确定不全', 'value': '缺卷'}, 
                {'label': '其他', 'value': ''}, 
                {'label': '关闭', 'value': '关闭'}, 
            ],
            tooltipShow: '',
            isShowlostVolume: false,
            countryList: [
                {label: '国家', value: ''},
                {label: '中国', value: '中国'},
                {label: '韩国', value: '韩国'}
            ],
        };
    },
    mounted: function(){
        let parameter = {};
        
        this.argumentsList.forEach((ele) => {
            parameter[ele.fieldName] = '';
        });
        this.parameter = parameter;

        this.getGenealogyDetail();
    },
    methods:{
        changeLostVolume(data){
            if(data.value != '关闭'){
                this.parameter['lostVolume'] = data.value;
            }
            
            this.isShowlostVolume = false;
        },
        handleClickInput(fieldName){
            if(fieldName == 'lostVolume'){
                this.isShowlostVolume = true;
            }
        },
        changeTooltip(t){
            console.log(t);
            if(this.tooltipShow == t){
                this.tooltipShow = '';
            }else{
                this.tooltipShow = t;
            }
        },
        saveCondition(data){
            this.parameter['condition'] = data;
            this.isOpen = 0;
        },
        savePlace(data){
            this.isOpen = 0;
            this.parameter['prov'] = data.province;
            this.parameter['city'] = data.city;
            this.parameter['district'] = data.district;
            this.parameter['place'] = data.province+data.city+data.district+data.place;
        },
        handleOpenAutoCompleteSearch(){
            window.open('/'+this.pathname+'/autoCompleteSearch?place='+this.parameter['place']);
        },
        close(f = false){
            this.$emit('close', f);
        },
        async getGenealogyDetail(){
            const result = await api.getAxios('catalog/detail?catalogKey='+this.dataKey);
            if(result.status == 200){
                let parameter = {};
                this.changeFieldArr = result.data.changeFieldArr || [];
                this.changeFieldArrAll = result.data.changeFieldArrAll || [];
                this.argumentsList.forEach((ele) => {
                    parameter[ele.fieldName] = result.data[ele.fieldName] || '';
                });

                this.parameter = parameter;

                this.parameter['explain'] = result.data['explain'] || '';
                this.parameter['memo'] = result.data['memo'] || '';
                this.parameter['condition'] = result.data['condition'] || '';
                this.parameter['country'] = result.data['country'] || '中国';
                this.GCOver = result.data.GCOver ? '1' : '';
                this.NoIndex = result.data.NoIndex ? 1 : 0;

                this.detail = result.data;

                this.isEdit = true;
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        async editCatalog(){// 编辑谱目
            let dataObj = {};
            this.argumentsList.forEach((ele) => {
                if(!ele.disabled){
                    dataObj[ele.fieldName] = this.parameter[ele.fieldName] || '';
                }
            });
            dataObj['lostVolume'] = this.parameter['lostVolume'].replace(/\s+/g, '');
            dataObj['explain'] = this.parameter['explain'] || '';
            dataObj['memo'] = this.parameter['memo'] || '';
            dataObj['GCOver'] = this.GCOver;
            dataObj['NoIndex'] = this.NoIndex ? 1 : 0;
            dataObj['country'] = this.parameter['country'] || '';

            let result = await api.patchAxios('data/edit', {
                'dataKey': this.dataKey,
                'dataObj': dataObj,
                'userKey': this.userId, 
                'siteKey': this.stationKey,
            });

            if(result.status == 200){
                this.close(true);
            }else{
                this.$XModal.message({ message: result.msg, status: 'warning' });
            }
        },
        saveData(){
            // 必填项判断
            console.log(this.parameter);
            let required = false, fieldMeans = '';
            this.argumentsList.forEach((currentValue, index) => {
                if(currentValue.required && !this.parameter[currentValue.fieldName]){
                    required = true;
                    if(!fieldMeans){
                        fieldMeans = currentValue.fieldMeans;
                    }
                }
            });

            if(required){
                return this.$XModal.message({ message: fieldMeans+'必填！'+(fieldMeans == '堂号' ? '无堂号可填 无' : ''), status: 'warning' });
            }

            // [,\./;'\\\[\]~!@#\$%\^&*()_+-=<>\?:"|{}"'`]|[，。、；‘、【】~！@#￥%……&*（）——+\-=《》？：“|{}·]  标点符号

            /** 
             * 标错规则
             * */ 

            // 谱名 可以放半型“.“”( )”，不可以有其他標點符號，不可有空格，可拆字（），不可有阿拉伯數字
            if(new RegExp(/\d+/g).test(this.parameter['genealogyName']) && this.parameter['genealogyName']){
                return this.$XModal.message({ message: '谱名 不可有阿拉伯数字', status: 'warning' });
            }
            if(new RegExp(/[,\/;'\\\[\]~!@#\$%\^&\*_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[，、；‘、【】~！@#￥%……&*——+\-=《》？：“|{}·]/g).test(this.parameter['genealogyName']) && this.parameter['genealogyName']){
                return this.$XModal.message({ message: '谱名 不可以有其他標點符號，除了 . () 拆字可用（）', status: 'warning' });
            }
            if(new RegExp(/[\s]/g).test(this.parameter['genealogyName']) && this.parameter['genealogyName']){
                return this.$XModal.message({ message: '谱名 不可有空格', status: 'warning' });
            }

            this.parameter['genealogyName'] = this.parameter['genealogyName'].replace(/。/g, '.').replace(/（/g, '(').replace(/）/g, ')');

            // 姓氏 第1欄不可為空白，第2-3欄可以空白；提供三個欄位，每個欄位只能放一個姓氏，不可加“氏”，最多三個姓氏
            if(this.parameter['surname'] && this.parameter['surname'].indexOf('氏') > -1){
                return this.$XModal.message({ message: '姓氏不可添加 氏', status: 'warning' });
            }
            if(this.parameter['surname2'] && this.parameter['surname2'].indexOf('氏') > -1){
                return this.$XModal.message({ message: '姓氏2不可添加 氏', status: 'warning' });
            }
            if(this.parameter['surname3'] && this.parameter['surname3'].indexOf('氏') > -1){
                return this.$XModal.message({ message: '姓氏3不可添加 氏', status: 'warning' });
            }

            // 出版年 只能填入阿拉伯數字，不可加“年”
            // if(this.parameter['publish'] && this.parameter['publish'].indexOf('年') > -1){
            //     return this.$XModal.message({ message: '出版年不可添加 年', status: 'warning' });
            // }
            if(new RegExp(/[\D]/g).test(this.parameter['publish'])){
                return this.$XModal.message({ message: '出版年必须是数字', status: 'warning' });
            }

            // 堂号 不可空白，如無堂號請填“無”
            if(new RegExp(/[,.\/;'\\\[\]~!@#\$%\^&\*_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[，。、；‘、【】~！@#￥%……&*——+\-=《》？：“|{}·]/g).test(this.parameter['hall']) && this.parameter['hall']){
                return this.$XModal.message({ message: '谱名 不可以有其他標點符號，除了 () 拆字可用（）', status: 'warning' });
            }

            this.parameter['hall'] = this.parameter['hall'].replace(/（/g, '(').replace(/）/g, ')');

            // 一世祖、始迁祖    只能放1個人的完整姓名（姓+名），不可有其他標點符號除了拆字（）
            // if(this.parameter['firstAncestor'][this.parameter['firstAncestor'].length - 1] == '公'){
            //     return this.$XModal.message({ message: '一世祖最后一个字不能是 公', status: 'warning' });
            // }
            if(new RegExp(/[,\.\/;'\\\[\]~!@#\$%\^&\*_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[，。、；‘、【】~！@#￥%……&*——+\-=《》？：“|{}·]/g).test(this.parameter['firstAncestor']) && this.parameter['firstAncestor']){
                return this.$XModal.message({ message: '一世祖不可有其他標點符號，除了拆字（）', status: 'warning' });
            }

            this.parameter['firstAncestor'] = this.parameter['firstAncestor'].replace(/（/g, '(').replace(/）/g, ')');

            if(new RegExp(/[,\.\/;'\\\[\]~!@#\$%\^&\*_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[，。、；‘、【】~！@#￥%……&*——+\-=《》？：“|{}·]/g).test(this.parameter['migrationAncestor']) && this.parameter['migrationAncestor']){
                return this.$XModal.message({ message: '始迁祖不可有其他標點符號，除了拆字（）', status: 'warning' });
            }

            this.parameter['migrationAncestor'] = this.parameter['migrationAncestor'].replace(/（/g, '(').replace(/）/g, ')');

            // 谱籍地(原谱)    不同的行政區劃需用","分開，只能放文字，國字數字小寫，不可有空格,不可有其他標點符號,除了拆字（）
            if(new RegExp(/[\.\/;'\\\[\]~!@#\$%\^&\*_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[。、；‘、【】~！@#￥%……&*——+\-=《》？：“|{}·]/g).test(this.parameter['LocalityModern']) && this.parameter['LocalityModern']){
                return this.$XModal.message({ message: '谱籍地(原谱)不可有其他標點符號，除了拆字（）或者用 , 分割行政区', status: 'warning' });
            }

            this.parameter['LocalityModern'] = this.parameter['LocalityModern'].replace(/，/g, ',').replace(/（/g, '(').replace(/）/g, ')');

            // if(new RegExp(/[\s]/g).test(this.parameter['LocalityModern']) && this.parameter['LocalityModern']){
            //     return this.$XModal.message({ message: '谱籍地(原谱)不可有空格', status: 'warning' });
            // }
            // if(new RegExp(/[\d]/g).test(this.parameter['LocalityModern']) && this.parameter['LocalityModern']){
            //     return this.$XModal.message({ message: '谱籍地(原谱) 国字数字小写', status: 'warning' });
            // }

            // 谱籍地(現代)    不同的行政區劃需用","只能放文字，國字數字小寫, 分開只能錄入一個完整地名，含省份，市，縣，鄉/鎮/街道，如果有村可錄入；
            if(new RegExp(/[\.\/;'\\\[\]~!@#\$%\^&\*()_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[。、；‘、【】~！@#￥%……&*（）——+\-=《》？：“|{}·]/g).test(this.parameter['place']) && this.parameter['place']){
                return this.$XModal.message({ message: '谱籍地(現代)不可有其他標點符號，除了用 , 分割行政区', status: 'warning' });
            }
            if(new RegExp(/[\s]/g).test(this.parameter['place']) && this.parameter['place']){
                return this.$XModal.message({ message: '谱籍地(現代)不可有空格', status: 'warning' });
            }

            this.parameter['place'] = this.parameter['place'].replace(/，/g, ',');

            // if(new RegExp(/[\d]/g).test(this.parameter['place']) && this.parameter['place']){
            //     return this.$XModal.message({ message: '谱籍地(現代) 国字数字小写', status: 'warning' });
            // }

            // 总卷数    依照譜書目錄填入卷（冊）數，可以使用","，不可有空格  不分卷全____冊
            if(new RegExp(/[\s]/g).test(this.parameter['volume']) && this.parameter['volume']){
                return this.$XModal.message({ message: '总卷数不可有空格', status: 'warning' });
            }
            if(new RegExp(/[\.\/;'\\\[\]~!@#\$%\^&\*\(\)_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[。、；‘、【】~！@#￥%……&*（）——+\-=《》？：“|{}·]/g).test(this.parameter['volume']) && this.parameter['volume']){
                return this.$XModal.message({ message: '总卷数不可有其他標點符號，除了 ,', status: 'warning' });
            }

            this.parameter['volume'] = this.parameter['volume'].replace(/，/g, ',');

            // 缺卷说明    
            /**提供錄入選單如下
            *選項1：總卷數欄位如為總卷數不詳，填"存卷______________”；
            *選項2：總卷數欄位如為不分卷且確定不全，填"存___冊”；
            *選項3：不缺卷:"0"
            *選項4：知道總卷數且確定不全，則填“缺。。。”
            *選項5：其他（可自由填入資訊）
            *只可以使用半型“,“~“，數字必須是阿拉伯數字，不可有空格；
            */
            if(new RegExp(/[\.\/;'\\\[\]!@#\$%\^&\*\(\)_\+\-\=<>\?\:\"\|\{\}\"\'\`]|[。、；‘、【】！@#￥%……&*（）——+\-=《》？：“|{}·]/g).test(this.parameter['lostVolume']) && this.parameter['lostVolume']){
                return this.$XModal.message({ message: '缺卷说明 不可有其他標點符號，除了 , ~', status: 'warning' });
            }
            // if(new RegExp(/[\s]/g).test(this.parameter['lostVolume']) && this.parameter['lostVolume']){
            //     return this.$XModal.message({ message: '缺卷说明不可有空格', status: 'warning' });
            // }
            // \u4e00-\u9fa5\u767e\u5343\u96f6
            if(new RegExp(/零|一|二|三|四|五|六|七|八|九|十|百|千|万|亿/g).test(this.parameter['lostVolume']) && this.parameter['lostVolume']){
                return this.$XModal.message({ message: '缺卷说明 数字必须是阿拉伯数字', status: 'warning' });
            }

            this.parameter['lostVolume'] = this.parameter['lostVolume'].replace(/，/g, ',').replace(/~/g, '~');

            // 可拍册数    只要填阿拉伯數字，沒有文字
            if(!new RegExp(/^[1-9]\d*$/g).test(this.parameter['hasVolume']) && this.parameter['hasVolume']){
                return this.$XModal.message({ message: '可拍册数 只能是非零阿拉伯数字', status: 'warning' });
            }

            // 作者    只能放1個人的完整姓名（姓+名）,除了拆字（），不可有其他標點符號；可寫不詳
            if(new RegExp(/[,\./;'\\\[\]~!@#\$%\^&*_+-=<>\?:"|{}"'`]|[，。、；‘、【】~！@#￥%……&*——+\-=《》？：“|{}·]/g).test(this.parameter['authors']) && this.parameter['authors']){
                return this.$XModal.message({ message: '作者 不可有其他標點符號，除了拆字 （）', status: 'warning' });
            }

            this.parameter['authors'] = this.parameter['authors'].replace(/（/g, '(').replace(/）/g, ')');

            // 作者职务    只能放1個職務，不可有標點符號；可寫不詳
            if(new RegExp(/[,\./;'\\\[\]~!@#\$%\^&*()_+-=<>\?:"|{}"'`]|[，。、；‘、【】~！@#￥%……&*（）——+\-=《》？：“|{}·]/g).test(this.parameter['authorJob']) && this.parameter['authorJob']){
                return this.$XModal.message({ message: '作者职务 不可有標點符號', status: 'warning' });
            }

            // 备注    必須要半型的標點符號
            if(new RegExp(/[\/'\\\[\]!@#\$%\^&\*_\+\-\=<>\?\"\|\{\}\"\'\`]|[、‘、【】！@#￥%……&*——+\-=《》？“|{}·]/g).test(this.parameter['memo']) && this.parameter['memo']){
                return this.$XModal.message({ message: '备注 只能半型標點符號 , . () ~:;', status: 'warning' });
            }

            this.parameter['memo'] = this.parameter['memo'].replace(/，/g,',').replace(/。/g,'.').replace(/（/g, '(').replace(/）/g, ')').replace(/~/g,'~').replace(/：/g,':').replace(/；/g, ';');

            // 说明    必須要半型的標點符號
            if(new RegExp(/[\/'\\\[\]!@#\$%\^&\*_\+\-\=<>\?\"\|\{\}\"\'`]|[、‘、【】！@#￥%……&*——+\-=《》？“|{}·]/g).test(this.parameter['explain']) && this.parameter['explain']){
                return this.$XModal.message({ message: '说明 只能半型標點符號 , . () ~:;', status: 'warning' });
            }

            this.parameter['explain'] = this.parameter['explain'].replace(/，/g,',').replace(/。/g,'.').replace(/（/g, '(').replace(/）/g, ')').replace(/~/g,'~').replace(/：/g,':').replace(/；/g, ';');

            this.editCatalog();
        },
    },
    computed: {
        ...mapState({
            TOKEN: state => state.nav.TOKEN,
            userName: state => state.nav.userName,
            userId: state => state.nav.userId,
            stationKey: state => state.nav.stationKey,
            role: state => state.nav.role,
            pathname: state => state.nav.pathname,
            orgAdmin: state => state.nav.orgAdmin,
        })
    },
    watch:{
        'dataKey': function(nv, ov){
            let parameter = {};
        
            this.argumentsList.forEach((ele) => {
                parameter[ele.fieldName] = '';
            });
            this.parameter = parameter;

            this.getGenealogyDetail();
        }
    }
};
</script>

<style scoped lang="scss">
.catalog-edit-wrap{
    // position: fixed;
    // top: 40px;
    // bottom: 100px;
    // right: 0;
    background: #fff;
    font-size: 14px;
    color: #000;
    padding: 10px 15px;
    box-shadow: 0 0 1px 1px #ddd;
    z-index: 1000;
    &.read{
        top: 0;
        bottom: 0;
        z-index: 100;
    }
    .head-box{
        position: relative;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .close{
            cursor: pointer;
        }
    }
    .content-box{
        position: relative;
        width: 400px;
        height: calc(100% - 80px);
        overflow-y: auto;
        overflow-x: visible;
        .edit-content{
            position: relative;
            // overflow-y: auto;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            width: 100%;
            li{
                position: relative;
                width: calc(50% - 5px);
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                &.w100{
                    width: 100%;
                }
                .label{
                    width: 75px;
                    display: flex;
                    align-items: center;
                    cursor: pointer;
                    .tooltip{
                        position: relative;
                        z-index: 10;
                        width: 15px;
                        height: 15px;
                        // display: none;
                        p{
                            position: absolute;
                            top: 20px;
                            left: 50%;
                            transform: translateX(-50%);
                            background: #000;
                            max-width: 430px;
                            width: 200px;
                            padding: 2px 5px;
                            border-radius: 5px;
                            color: #fff;
                            font-size: 14px;
                            &.active{
                                left: -30px;
                                transform: translateX(0);
                            }
                        }
                    }
                    .title{
                        cursor: pointer;
                        height: 15px;
                    }
                    &.w105{
                        width: 105px;
                    }
                }
                .edit{
                    background: #000;
                    margin-left: 10px;
                    cursor: pointer;
                }
                .textarea{
                    width: calc(100% - 75px);
                    font-size: 14px;
                    cursor: pointer;
                }
                &:hover{
                    .label{
                        .tooltip{
                            display: inline-block;
                        }
                    }
                }
            }
        }
    }
    .foot-box{
        position: relative;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
i{
    font-style: normal;
}
.w90{
    position: relative;
    width: calc(100% - 75px);
    font-size: 14px;
    text-align: left;
    label{
        margin-left: 0;
    }
}
.w80{
    width: calc(100% - 120px);
}
.w33{
    width: 33%;
}
.marginL10{
    margin-left: 10px;
}
.lostVolume-ul{
    position: absolute;
    top: 40px;
    left: 75px;
    width: 323px;
    z-index: 100;
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border: 1px solid #e4e7ed;
    border-radius: 4px;
    background-color: #fff;
    text-align: left;
    .lostVolume-li{
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        text-indent: 20px;
        &:hover{
            color: #409EFF;
            font-weight: 700;
        }
    }
}
</style>

