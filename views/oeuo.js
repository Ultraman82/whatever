
    var main = new Vue({
        el: '#app',
        data: {
            koreanName: '',
            englishName: 'null',
            error: ''
        },
        methods: {
            isHangul: function (str, len) {
                if (typeof str !== 'string' || str.length === 0) {
                    return false
                }
                if (!len || len < 0 || len > str.length) {
                    len = str.length
                }
                for (let i = 0; i < len; i++) {
                    let c = str.charCodeAt(i)
                    if (c == 32) {
                        return true
                    }
                    if (c < 0xAC00 || c > 0xD7A3) {
                        return false
                    }
                }
                return true
            },  
            isSwear: function (input) {
                if (
                    input.includes("poop")  || 
                    input.includes("stupid") || 
                    input.includes("babo") || 
                    input.includes("fuck") || 
                    input.includes("shit") ) {
                        return true;
                    } else {
                        return false;
                    }
            },
            invalidEnglishName: function (input) {
                if (input.length < 2) {
                    if (this.error.includes('name must be longer')) {
                        return true;
                    } else {
                        this.error += 'name must be longer ';
                        return true;
                    } 
                } else {
                    if (this.error.includes('name must be longer')) {
                        this.error = this.error.replace("name must be longer ", "");
                    }
                }
                if ( isSwear(englishName) ) {
                        if (this.error.includes('terrible name')) {
                            return true;
                        } else {
                            this.error += "that's a terrible name ";
                            return true;
                        }
                } else {
                    if (this.error.includes('terrible name')) {
                        this.error = this.error.replace("that's a terrible name ", "");
                    }
                }
                if (input.search(/\d/) > -1) {
                    if (this.error.includes('numbers')) {
                        return true;
                    } else {
                        this.error += "no numbers ";
                        return true;
                    }
                    
                } else {
                    if (this.error.includes('no number')) {
                        this.error = this.error.replace("no numbers ", "");
                    }
                }
                return false;
            },
            isNumber: function (input) {
                if (input.search(/\D/)) {
                    return false;
                }
            }
        }
    });

//   data: {
//     errors: [],
//     koreanName: null,
//     englishName: null,
//     username: null,
//     classId: null,
//     password: null,
//     petname: null
//   },
//   methods:{
//     checkForm: function (e) {
//       if (this.koreanName && this.englishName) {
//         return true;
//       }
//       this.errors = [];
//       if (!this.englishName) {
//         this.errors.push('Name required.');
//       } else if (!this.validName(this.englishName)) {
//         this.errors.push('This in not a proper English name');
//       }
//       if (!this.koreanName) {
//         this.errors.push('Age required.');
//       }

//       e.preventDefault();
//     },
//     validName: function(e) {
//         console.log(e);
//         if (this.englishName == "poop") {
//             return false;
//         }
//     }
//   }