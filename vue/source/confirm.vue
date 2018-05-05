<template>
    <div id="app" v-cloak>
        <!-- @keydown.enter.prevent用于阻止默认时间 -->
        <input class="newuser-input" type="text" @keydown.enter.prevent='addUser' ref='newuser' placeholder="New user...">
        <!-- 每一个用户点击的时候触发delete -->
        <ul class="users">
            <li v-for='u in users' :key='u.id' mode="out-in">{{u.name}}
                <button class="deleteBtn" @click="confirmDelete(u)">x</button>
            </li>
        </ul>
        <!-- confirmation-modal接受一个user和open参数，同时接受的事件为confirm和cancel事件，组件内部通过emit触发 -->
        <confirmation-modal :user="selectedUser" v-if='confirmModal' @confirm='deleteUser' @cancel="cancelDelete"></confirmation-modal>
        <button v-if="this.users.length > 2" @click="shuffle">Shuffle</button>
    </div>
    <!-- 这里使用了非匿名的template -->
</template>
<script>
import Vue from "vue";
Vue.component("confirmation-modal", {
    // template: "#modal",
    // 这种指定id的例子是如何使用的，必须在index.html中书写
    props: ["open", "user"],
    template: `
        <div class="modal">
            <div class="modal-window">
                <p>你确定要删除
                    <strong style="color:red">{{ user.name }}</strong> ?</p>
                <div class="actions">
                    <button class="cancel" @click="onCancel">取消</button>
                    <button class="confirm" @click="onConfirm">确认</button>
                </div>
            </div>
        </div>`,
    methods: {
        // confirmation-modal就是template渲染后的内容，点击取消或者确认的时候emit特定的事件
        onConfirm() {
            this.$emit("confirm");
        },
        onCancel() {
            this.$emit("cancel");
        }
    }
});

class User {
    constructor(name) {
        this.name = name;
        this.id = ++User.id;
    }
}

User.id = 0;
// 父组件被挂载的时候push了多个用户
export default {
    data: function() {
        return {
            users: [],
            confirmModal: false,
            selectedUser: null
        }
    },
    mounted: function() {
        console.log('我自己被挂载了...');
    },
    created() {
        this.users.push(new User('Guillaume'))
        this.users.push(new User('Vianney'))
        this.users.push(new User('Justin'))
        this.shuffle()
    },
    methods: {
        /**
         * 添加user是通过this.$refs.newuser.value
         */
        addUser() {
            let user = this.$refs.newuser.value;
            if (user) {
                this.users.push(new User(user));
                this.$refs.newuser.value = "";
            }
        },
        shuffle() {
            this.users.sort(() => Math.random() > 0.5);
        },
        // 设置弹窗可见并设置选中的用户
        confirmDelete(u) {
            this.selectedUser = u;
            this.confirmModal = true;
        },
        cancelDelete() {
            this.confirmModal = false;
            this.selectedUser = null;
        },
        deleteUser() {
            this.confirmModal = false;
            let index = this.users.indexOf(this.selectedUser);
            this.users.splice(index, 1);
            this.selectedUser = null;
        }
    }
}
</script>
<style>
*,
*::before,
*::after {
    box-sizing: border-box;
}

body {
    overflow-x: hidden;
    padding: 0;
    margin: 0;
    font-family: sans-serif;
    background: #555;
    color: white;
}

[v-cloak] {
    display: none;
}

#app {
    max-width: 1080px;
    margin: 0 auto;
    padding: 10px;
}

button {
    cursor: pointer;
}

.users {
    list-style: none;
    margin: 0;
    padding: 0;
    margin: 1em 0;
    line-height: 2;
}

.users li {
    padding: 4px 2em;
    display: flex;
    justify-content: space-between;
    background: rgba(0, 0, 0, .2);
    margin-bottom: 6px;
}

.users li:nth-of-type(even) {
    background: rgba(0, 0, 0, .2);
}

.users li:nth-of-type(odd) {
    background: rgba(0, 0, 0, .4);
}

.deleteBtn {
    all: unset;
    cursor: pointer;
}

.newuser-input {
    font-size: inherit;
    padding: 4px;
    display: block;
    width: 100%;
    margin: 0 auto;
}

.user-enter {
    opacity: 0;
    transform: translateY(-5px);
}

.user-enter-active {
    transition: .3s;
}

.user-leave-active {
    opacity: 0;
    transform: translateX(50px);
    transition: .3s;
}

.user-move {
    transition: .5s;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, .5);
}

.modal-window {
    position: absolute;
    top: 50%;
    left: 50%;
    transition: .5s;
    width: 100%;
    min-width: 400px;
    max-width: 600px;
    background: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    transform: translate(-50%, -50%);
    padding: 1em;
    color: black;
    text-align: center;
}

.modal-window .actions {
    display: flex;
    justify-content: flex-end;
}

.actions button {
    font-size: inherit;
    margin: 4px;
    border: none;
    padding: 6px 8px;
    cursor: pointer;
}

.actions .cancel {
    background: darkred;
    color: white;
}

.actions .confirm {
    background: darkcyan;
    color: white;
}

.appear-enter {
    opacity: 0;
}

.appear-enter .modal-window {
    transform: translate(-75%, -50%);
}

.appear-enter-active {
    transition: .5s;
}

.appear-leave-active .modal-window {
    transform: translate(0, -50%);
}

.appear-leave-active {
    opacity: 0;
    transition: .5s;
}
</style>
