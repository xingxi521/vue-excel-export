export default{
    strEnCode(str){
        var c = String.fromCharCode(str.charCodeAt(0) + str.length);
        for (var i = 1; i < str.length; i++) {
            c += String.fromCharCode(str.charCodeAt(i) + str.charCodeAt(i - 1));
        }
        return encodeURIComponent(c);
    },
    //格式化时间 -- formatDate(new Date())
    formatDate(date){
        var date = new Date(date);
        var YY = date.getFullYear() + '-';
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        var ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
        return YY + MM + DD +" "+hh + mm + ss;
    },
    //防抖
    debounce(fn, delay = 500) {
        let timer = null
        return function () {
            if (timer) {
                clearTimeout(timer)
            }
            timer = setTimeout(()=> {
                fn.apply(this, arguments)
                timer = null
            }, delay)
        }
    },
    /*
        * 参数说明：
        * number：要格式化的数字
        * decimals：保留几位小数
        * dec_point：小数点符号
        * thousands_sep：千分位符号
    * 
    */
    number_format(number, decimals, dec_point, thousands_sep) {
        number = (number + '').replace(/[^0-9+-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
            sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
            dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + Math.ceil(n * k) / k;
            };
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        var re = /(-?\d+)(\d{3})/;
        while (re.test(s[0])) {
            s[0] = s[0].replace(re, "$1" + sep + "$2");
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    },
    //检测数组里每个对象中某个字段是否为空  true为空， false不为空
    checkTrimArr(arr,key){
        if(arr.length === 0){
            return true;
        }else{
            for (let index = 0; index < arr.length; index++) {
                if(arr[index][key] == '' || arr[index][key] == undefined){
                    return true;
                }
            }
            return false;
        }
    },
    //检测数据是否合法  true是合法，false不合法
    /**
     * 
     * @param {*目标数组} arr 
     * @param {*需要检测的键名} key 
     * @param {*1为检测非负整数 可选参数} type 
     * @param {*正则表达式，可选参数} exp 
     * @returns 
     */
    checkData(arr,key,type,exp){
        if(arr.length === 0){
            return false;
        }else{
            var reg = {};
            for (var index = 0; index < arr.length; index++) {
                if(type === 1){//非负整数
                    reg = new RegExp('^\\d+$','g');
                }else if(type === 2){//1-100整数
                    reg = new RegExp('^([1-9]|[1-9]\\d|100)$','g')
                }else{
                    reg = new RegExp(exp,'g');
                }
                if(!reg.test(arr[index][key])){
                    return false;
                }
            }
            return true;
        }
    },
    //检测对象中某个字段的值在数组对象里是否已经存在  true已经存在， false不存在
    /**
     * 
     * @param {检测的键名} key 
     * @param {*检测的值，如果many为true传一个要检测的数组进来} value 
     * @param {*数据源的数组} arr 
     * @param {*当前索引，many为false时才需要用到} idx 
     * @param {*是否多对多} many 
     * @returns 
     */
    checkKeyExit(key,value,arr,idx,many=false){
        if(arr.length === 0){
            return false;
        }else{
            if(many){//多对多，就是传两个数组的情况
                if(value.length === 0){
                    return false;
                }else{
                    for (let i = 0; i < arr.length; i++) {//数据源
                        for (let j = 0; j < value.length; j++) {//选中数据
                            if(value[j][key] === arr[i][key] && j!==i){
                                return true;
                            }
                        }
                    }
                    return false;
                }
            }else{
                for (let i = 0; i < arr.length; i++) {
                    if(arr[i][key] === value && idx != i){
                        return true;
                    }
                }
            }
            return false;
        }
    },
    //取出数组对象中的指定字段的值，返回一个数组或者一个字符串
    getFieldArr(arr,key,isStr){
        if(arr.length === 0){
            return isStr?'':[];
        }else{
            var resultArr = [];
            arr.forEach(item=>{
                resultArr.push(item[key]);
            });
        }
        return isStr?resultArr.join('-'):resultArr;
    },
    //格式化时间选择器的数组，返回一个对象
    formatePicker(arr){
        if(arr.length !== 2){
            return {fromDate:'',toDate:''};
        }else{
            return{
                fromDate:arr[0],
                toDate:arr[1]
            }
        }
    },
    //日期追加天数
    /**
      * [dateAddDays 从某个日期增加n天后的日期]
      * @param  {[string]} dateStr  [日期字符串]
      * @param  {[int]} dayCount [增加的天数]
      * @return {[string]}[增加n天后的日期字符串]
    */
    dateAddDays(dateStr,dayCount) {
        var tempDate = new Date(dateStr.replace(/-/g,"/"));//把日期字符串转换成日期格式
        var resultDate = new Date((tempDate/1000+(86400*dayCount))*1000);//增加n天后的日期
        var resultDateStr = resultDate.getFullYear()+"-"+(resultDate.getMonth()+1)+"-"+(resultDate.getDate());//将日期转化为字符串格式
        return resultDateStr;
    },
    /**
     * 创建枚举
     * 示例：
     * const STATUS = createEnum({
     *     AUDIT_WAIT: [1, '审核中'],
     *     AUDIT_PASS: [2, '审核通过']
     * })
     * 获取枚举值：STATUS.AUDIT_WAIT
     * 获取枚举描述：STATUS.getDesc('AUDIT_WAIT')
     * 通过枚举值获取描述：STATUS.getDescFromValue(STATUS.WAIT)
     *
     */
    createEnum(definition) {
        const strToValueMap = {}
        const numToDescMap = {}
        for (const enumName of Object.keys(definition)) {
            const [value, desc] = definition[enumName]
            strToValueMap[enumName] = value
            numToDescMap[value] = desc
        }
        return {
            ...strToValueMap,
            getDesc(enumName) {
            return (definition[enumName] && definition[enumName][1]) || ''
            },
            getDescFromValue(value) {
            return numToDescMap[value] || ''
            }
        }
    }

}