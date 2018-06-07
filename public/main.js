var mainVm = new Vue({
    el: '#app',
    data: {
        newUserName: '',
        newUserPassword: '',
        oldUserName: '',
        oldUserPassword: '',
        user: {},
        href: '',
        // signin_msg = '',
        allCompanys: [],
        jobAds: [],
        isInVisible: true,
        isVisible: false,
        invisible: '',
        enterCompanyName: '',
        enterCompanyPerson: '',
        enterCompanyAddress: '',
        enterCompanyTel: '',
        confirmCompanyAdded: ''
    },

    created: function() {
        // let that = this
        // $.get('/dash', function(data) {
        //         mainVm.user = data
        //         // that.getMyCompanys()
        //         that.getJobAds()
        //         console.log('mainVm.allCompanys: ', mainVm.allCompanys)
        //         console.log('companyname: ', this.companyname)
        //         console.log('companyperson: ', this.companyperson)
        //         console.log('companyaddress: ', this.companyaddress)
        //         console.log('companytel: ', this.companytel)
        //         console.log('/dash this.checkedObject: ', this.checkedObject)
        //         console.log('jobads: ', this.companyname)
        //
        //     }),
            $.get('/dash/companys', (data) => {
                this.allCompanys = data
                console.log('333333 data:', data);
                console.log('333333 this.allCompanys:', this.allCompanys)
            }).then(() => {
            }),

            $.get('/dash/jobads', (data) => {
                this.jobAds = data
            }).then((data) => {
              console.log('5555 data:', data);
            })




    },

    methods: {
        // createEmpty: function(){
        //     if (this.allCompanys.length !=0){
        //     }
        //     else{
        //         $.ajax({
        //             url: '/create-vocab',
        //             type: 'POST',
        //             data: JSON.stringify({
        //                 _languser: mainVm.user._id,
        //                 kyrgyzword: '',
        //                 englishword: '',
        //                 wordknown: 0,
        //                 wordachieve: ''
        //             }),
        //             contentType: 'application/json; charset=utf-8',
        //             dataType: 'json',
        //             success: function(dataFromServer){
        //                 console.log('/create-vocab dataFromServer: ', dataFromServer)
        //                 if (dataFromServer.success){
        //                     mainVm.getMyVocabs()
        //                 }
        //             }
        //         })
        //     }
        // },
        //
        getMyCompanys: function() {
            $.get('/dash/companys', (data) => {
                this.allCompanys = data
                console.log('this.allCompanys:', this.allCompanys)
            }).then(() => {
            })
        },

        // getJobAds: function() {
        //     $.get('/dash/jobads', (data) => {
        //       console.log('calling /dash/jobads !!!');
        //         this.jobAds = data
        //         console.log('yep, this is the data:',data);
        //         console.log('this.jobAds:', this.jobAds)
        //     }).then(() => {
        //     })
        // },

        createUser: function(event) {
            event.preventDefault()
            var that = this
            console.log('this.newUserName:', this.newUserName)
            $.ajax({
                url: '/custard-user',
                type: 'POST',
                data: JSON.stringify({
                    username: this.newUserName,
                    password: this.newUserPassword
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/custard-user dataFromServer: ', dataFromServer)
                    if (dataFromServer.success) {
                        window.location.href = "/dashboard.html"
                    }
                }
            })
            // this.createEmpty()
        },


        createCoOp: function(event) {
          var data = event.target.dataset
          console.log('data: ', data);
          console.log('event:', event);
          event.preventDefault()
          $.ajax({
              url: '/create-op',
              type: 'POST',
              data: JSON.stringify({
                  _custarduser: mainVm.user._id,
                  opjobtitle: data.adJobtitle,
                  opemployer: data.adEmployer,
                  oplocation: data.adLocation,
                  opurl: data.adUrl
              }),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              success: function(dataFromServer) {
                  console.log('/create-op dataFromServer: ', dataFromServer)
                  if (dataFromServer.success) {
                      mainVm.getMyCompanys()
                      console.log('success! yay!');
                  }
              }
          })
        },

        signInUser: function(event) {
            event.preventDefault()
            var that = this
            console.log('signInUser this.oldUserName: ', this.oldUserName)
            $.ajax({
                url: '/signin-user',
                type: 'POST',
                data: JSON.stringify({
                    username: this.oldUserName,
                    password: this.oldUserPassword
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/signin-user dataFromServer: ', dataFromServer)
                    if (dataFromServer.success) {
                        window.location.href = "/dashboard.html"
                    } else {
                      signin_msg = 'Nope!'
                    }
                }
            })
        },

        logOutUser: function(event) {
            event.preventDefault()
            window.location.href = "/index.html"
        },

        createCompany: function(event) {
            event.preventDefault()
            $.ajax({
                url: '/create-company',
                type: 'POST',
                data: JSON.stringify({
                    _custarduser: mainVm.user._id,
                    companyname: this.enterCompanyName,
                    companyperson: this.enterCompanyPerson,
                    companyaddress: this.enterCompanyAddress,
                    companytel: this.enterCompanyTel
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/create-company dataFromServer: ', dataFromServer)
                    if (dataFromServer.success) {
                        mainVm.getMyCompanys()
                        console.log('success! yay!');
                    }
                }
            })
            this.enterCompanyName = ''
            this.enterCompanyPerson = ''
            this.enterCompanyAddress = ''
            this.enterCompanyTel = ''
            this.confirmAdded()
        },

        createOp: function(event) {
            event.preventDefault()
            $.ajax({
                url: '/create-op',
                type: 'POST',
                data: JSON.stringify({
                    _custarduser: mainVm.user._id,
                    companyname: this.enterCompanyName,
                    companyperson: this.enterCompanyPerson,
                    companyaddress: this.enterCompanyAddress,
                    companytel: this.enterCompanyTel
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/create-op dataFromServer: ', dataFromServer)
                    if (dataFromServer.success) {
                        mainVm.getMyCompanys()
                        console.log('success op! yay!');
                    }
                }
            })
            this.enterCompanyName = ''
            this.enterCompanyPerson = ''
            this.enterCompanyAddress = ''
            this.enterCompanyTel = ''
            this.confirmAdded()
        },

        confirmAdded: function() {
            this.confirmCompanyAdded = 'New Company Added!'
            setTimeout(() => {
                this.confirmCompanyAdded = ''
            }, 2000)
        },
    }
})
