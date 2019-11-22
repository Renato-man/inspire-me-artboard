//VUE INSTANCE

new Vue({
    el: "#main",
    data: {
        name: "Habanero!",
        seen: false,
        images: [],
        title: "",
        description: "",
        username: "",
        file: null,
        currentImage: false
        // location.hash.slice(1)

        //     animals: [
        //         {
        //             name: "Squid",
        //             emoji: "🦑"
        //         },
        //         {
        //             name: "Ewe",
        //             emoji: "🐑"
        //         }
        //     ]
    },
    mounted: function() {
        console.log("my vue component has mounted");
        console.log("this is my images data: ", this.images);
        var me = this;
        axios.get("/images").then(function(response) {
            console.log("response from images: ", response.data);
            me.images = response.data;
        });
    },
    methods: {
        myFunction: function(imageClickedOn) {
            console.log("My function is running");
            console.log("animalClickedOn: ", imageClickedOn);
            this.name = imageClickedOn;
        },
        handleClick: function(e) {
            var me = this;
            e.preventDefault();
            console.log("this: ", this.title);
            var fd = new FormData();
            fd.append("file", this.file);
            fd.append("title", this.title);
            fd.append("description", this.description);
            fd.append("username", this.username);
            axios
                .post("/upload", fd)
                .then(function({ data }) {
                    // console.log("this is the one: ", me.images);
                    console.log("resp from Post /upload", data);
                    me.images.unshift(data);
                })
                .catch(function(err) {
                    console.log("error in POST upload: ", err);
                });
        },
        handleChange: function(e) {
            console.log("handle change is happening!!");
            console.log("e.target.files[0]: ", e.target.files[0]);
            this.file = e.target.files[0];
        },
        getimageid: function(f) {
            this.currentImage = f;
            console.log(f);
        },
        unsetCurrentImage: function() {}
    }
});

////////////////////////////////////////////////////////////////
// VUE COMPONENT

Vue.component("image-modal", {
    template: "#my-template",
    data: function() {
        return {
            image: {},
            comments: [],
            username: "",
            comment: ""
        };
    },
    props: ["id"],
    methods: {
        myFunction: function(commentFunc) {
            console.log("My function is running");
            console.log("animalClickedOn: ", commentFunc);
            this.comment = commentFunc;
        },
        handleClickComment: function(e) {
            var me = this;
            e.preventDefault();
            var object = {
                username: me.username,
                comment: me.comment,
                id: me.id
            };
            console.log(me.username, me.comment);
            axios
                .post("/comments", object)
                .then(function({ data }) {
                    console.log("resp from Post /comment", data);
                    me.comments.unshift(data);
                })
                .catch(function(err) {
                    console.log("error in POST comment: ", err);
                });
        }

        //     // axios post request
        //     // add click event on submit
        //     // send object to the data base
    },
    mounted: function() {
        var me = this;
        // console.log(this.id);
        axios.get("/popup/" + this.id).then(function(response) {
            // console.log("response from images: ", response.data[0]);
            // console.log("me.images: ", this.image);
            me.image = response.data[0];
            console.log(me.image);
        });
        axios.get("/comments/" + this.id).then(function(response) {
            console.log("-------: ", response.data[0]);
            me.comments = response.data;
        });
    }
});
