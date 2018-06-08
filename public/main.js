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
        allOps: [],
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
        $.get('/dash/companys', (data) => {
            this.allCompanys = data
            console.log('333333 data:', data);
            console.log('333333 this.allCompanys:', this.allCompanys)
        }).then(() => {
        }),

        $.get('/dash/ops', (data) => {
            this.allOps = data
            console.log('77777 data:', data);
            console.log('777 this.allOps:', this.allOps)
        }).then(() => {
        }),

        $.get('/dash/jobads', (data) => {
                this.jobAds = data
            }).then((data) => {
              console.log('5555 data:', data);
            })
    },

    methods: {
        getMyCompanys: function() {
            $.get('/dash/companys', (data) => {
                this.allCompanys = data
                console.log('this.allCompanys:', this.allCompanys)
            }).then(() => {
            })
        },

        getMyOps: function() {
            $.get('/dash/ops', (data) => {
                this.allOps = data
                console.log('888 this.allOps:', this.allOps)
            }).then(() => {
            })
        },

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
        },

        createCoOp: function(event) {
          console.log('event', event);
          var data = event.target.dataset
          console.log('data: ', data);
          event.preventDefault()
          $.ajax({
              url: '/create-op',
              type: 'POST',
              data: JSON.stringify({
                  _custarduser: mainVm.user._id,
                  opjobtitle: data.adJobtitle,
                  opemployer: data.adEmployer,
                  oplocation: data.adLocation,
                  opurl: data.adUrl,
                  opstatus: data.adOpstatus
              }),
              contentType: 'application/json; charset=utf-8',
              dataType: 'json',
              success: function(dataFromServer) {
                  console.log('/create-op dataFromServer: ', dataFromServer)
                  if (dataFromServer.success) {
                      mainVm.getMyOps()
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

        deleteOp: function(event) {
          console.log('event', event);
          var data = event.target.dataset
          console.log('opurl to delete data.opurl: ', data);
          event.preventDefault()
          $.ajax({
            method: "POST",
            url: "/dash/delete_ops",
            data: {
              opJobtitle: data.opjobtitle,
              opEmployer: data.opemployer,
              opLocation: data.oplocation
            }
            ,
            success: "yay"
          })
          this.getMyOps()
           },

       // $('buttons.remove.doc').on('click', function() {
       //       var userId = $(this).attr('data-id');
       //       $.ajax({
       //          method: "POST",
       //          url: "/users/delete",
       //          data: {"userId": userId},
       //          success: function(result) {
       //             if(/* check if it is ok */) {
       //                 location.reload();
       //             }
       //          }
       //       })
       //    });

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
