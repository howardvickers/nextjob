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
        the_user: {},
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
        allOps: [],
        jobAds: [],
        enterState: '',
        enterCity: '',
        enterKeyword: ''
    },

    created: function() {
      console.log('created called');
      let that = this
      $.get('/me', function(data){
        mainVm.user = data
          this.user = data
          mainVm.refreshOps()
          console.log('this.user = data: ', data, this.user);
          console.log('that.user: ', that.user)
      })

        $.get('/dash/ops', (data) => {
            this.allOps = data
            console.log('77777 data:', data);
            console.log('777 this.allOps:', this.allOps)
        }).then(() => {})
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

        getMyOps: function() {
          console.log('getMyOps initiated')
            $.get('/dash/ops', (data) => {
                this.allOps = data
                console.log('this.allOps:', this.allOps)
            }).then(() => {})
        },

        refreshOps: function(event) {
            console.log('refreshOps mainVm.user._id: ', mainVm.user._id);
            console.log('refreshOps this.user._id: ', this.user._id);
            $.ajax({
                url: '/refresh-ops',
                type: 'POST',
                data: JSON.stringify({
                  _custarduser: mainVm.user._id
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('success refreshOps mainVm.user._id: ', mainVm.user._id);
                    console.log('/refresh-op dataFromServer: ', dataFromServer)
                    this.allOps = dataFromServer
                    mainVm.displayOps(dataFromServer)
                    console.log('this.allOps: ', this.allOps);
                    if (dataFromServer.success) {
                      console.log('this:', this.allOps);
                        console.log('refresh-ops success!');
                    }
                }
            })
        },

        getJobAds: function(data) {
            this.jobAds = data
            console.log('this.jobAds:', this.jobAds)
        },

        displayOps: function(data) {
            this.allOps = data
            console.log('3232323232 this.allOps:', this.allOps)

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
                    mainVm.getJobAds(dataFromServer)
                }
            })
        },

        createCoOp: function(event) {
            console.log('mainVm.user._id: ', mainVm.user._id);
            var data = event.target.dataset
            console.log('createCoOp data: ', data);
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
                        mainVm.refreshOps()
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
                        mainVm.refreshOps()
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

        signInDemo: function(event) {
            event.preventDefault()
            console.log('signInDemo this.oldUserName: ', "Bob!")
            $.ajax({
                url: '/signin-demo',
                type: 'POST',
                data: JSON.stringify({
                    username: "Bob",
                    password: "b"
                }),
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                success: function(dataFromServer) {
                    console.log('/signin-demo dataFromServer: ', dataFromServer)
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
            mainVm.user = ''
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
                this.refreshOps()
            })
        },
    }
})
