Vue.component('modal', {
    template: `<div class="modal is-active">
  <div class="modal-background">
  </div>
  <div class="modal-content">
  <div class="box">
  <p>Some text</p>
  </div>
  </div>
  <buton class="modal-close">close this</button>
  </div>`
})


var mainVm = new Vue({
    el: '#app',
    data: {
        showModal: false,
        applied: '',
        interview: '',
        offer: '',
        declined: '',
        rejected: '',
        apply: '',
        nothing: '',
        contact: '',
        meet: '',
        status: '',
        selected: '',
        signin_msg: '',
        register_msg: '',
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
        enterState: '',
        enterCity: '',
        enterKeyword: '',
        enterCompanyName: '',
        enterCompanyPerson: '',
        enterCompanyAddress: '',
        enterCompanyTel: '',
        confirmCompanyAdded: ''
    },

    created: function() {
        // $.get('/dash/companys', (data) => {
        //     this.allCompanys = data
        //     console.log('333333 data:', data);
        //     console.log('333333 this.allCompanys:', this.allCompanys)
        // }).then(() => {
        // }),

        $.get('/dash/ops', (data) => {
            this.allOps = data
            console.log('77777 data:', data);
            console.log('777 this.allOps:', this.allOps)
        }).then(() => {})

        // $.get('/dash/jobads', (data) => {
        //         this.jobAds = data
        //     }).then((data) => {
        //       console.log('5555 data:', data);
        //     })
    },

    methods: {
        modalID: function(url) {
            return btoa(url).replace(/=/g, '')
        },
        hashmodalID: function(url) {
            return '#' + btoa(url).replace(/=/g, '')
        },
        openModal: function(e) {
            e.preventDefault()
            var oModal = e.currentTarget.dataset.modalTarget
            console.log('oModal:', oModal);
            $(oModal).modal('toggle')

        },

        getMyCompanys: function() {
            $.get('/dash/companys', (data) => {
                this.allCompanys = data
                console.log('this.allCompanys:', this.allCompanys)
            }).then(() => {})
        },

        getMyOps: function() {
            $.get('/dash/ops', (data) => {
                this.allOps = data
                console.log('888 this.allOps:', this.allOps)
            }).then(() => {})
        },


        getJobAds: function(data) {
            this.jobAds = data
            console.log('222 this.jobAds:', this.jobAds)

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


        doSearch: function(event) {
            event.preventDefault()
            console.log('this.keyword:', this.enterKeyword);
            $.ajax({
                url: '/scrape',
                type: 'POST',
                data: JSON.stringify({
                    kw: this.enterKeyword,
                    cty: this.enterCity,
                    ste: this.enterState
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/scrape dataFromServer: ', dataFromServer)
                    this.jobAds = dataFromServer
                    console.log('this.jobAds:', this.jobAds);
                    mainVm.getJobAds(dataFromServer)

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
                    optodo: data.adTodo,
                    opstatus: data.adStatus
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

        editOp: function(event) {
            console.log('event', event);
            var data = event.target.dataset
            console.log('data: ', data);
            event.preventDefault()
            $.ajax({
                url: '/update',
                type: 'POST',
                data: JSON.stringify({
                    _custarduser: mainVm.user._id,
                    opjobtitle: data.opjobtitle,
                    opemployer: data.opemployer,
                    oplocation: data.oplocation,
                    opurl: data.opurl,
                    optodo: data.optodo,
                    opstatus: data.opstatus
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/edit-op dataFromServer: ', dataFromServer)
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

        RegisterUser: function(event) {
            event.preventDefault()
            var that = this
            console.log('RegisterUser this.newUserName: ', this.newUserName)
            $.ajax({
                url: '/register-user',
                type: 'POST',
                data: JSON.stringify({
                    username: this.newUserName,
                    password: this.newUserPassword
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/register-user dataFromServer: ', dataFromServer)
                    if (dataFromServer.success) {
                        window.location.href = "/dashboard.html"
                    } else {
                        register_msg = 'Nope!'
                    }
                }
            })
        },

        logOutUser: function(event) {
            event.preventDefault()
            window.location.href = "/index.html"
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
                },
                success: "yay"
            }).done((msg) => {
                console.log(msg);
                this.getMyOps()
            })

        },


        confirmAdded: function() {
            this.confirmCompanyAdded = 'New Company Added!'
            setTimeout(() => {
                this.confirmCompanyAdded = ''
            }, 2000)
        },
    }
})
