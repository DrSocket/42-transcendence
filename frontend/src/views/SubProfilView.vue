<template>
<div class="view-container" v-if="user">
	<div class="container">
		<img :src="DisplayImage()" class="avatar">
		<div class="block_container">
			<table>
				<thead>
					<th>USERNAME</th>
					<th>STATUS</th>
					<th>GAMES PLAYED </th>
					<th>GAMES WON </th>
					<th>GAMES LOSSE </th>
				</thead>
				<tbody>
				<tr>
						<td>{{user.username}}</td>  
						<td>{{ user.status }}</td>
						<td>{{user.tt_games}}</td> 
						<td>{{user.wins}}</td> 
						<td>{{user.losses}}</td>
					</tr> 
				</tbody>
			</table>
		</div>
	</div>
	<div class="block_container">
		<button @click="backHome()">RETURN HOME</button>
		<button v-if="!ifIsFriend()" @click="addFriend(user.username)">ADD FRIEND</button>
	</div>
</div>
</template>


<script lang="ts">
import store from '@/store';
import router from '@/router';
import { useRoute } from "vue-router";
import { Vue, Options } from 'vue-class-component'
import { ref } from 'vue';

@Options({
	name: 'SubProfilView'
})
export default class SubProfilView extends Vue {
	/* eslint-disable  @typescript-eslint/no-explicit-any */
	user: any = null
	image: any = {
		img: ref(null)
	}

	mounted = () => { 
		const route = useRoute();
		const username = route.params.username;
		// // // // console.log('ntm')
		if (store.state.isLoggedIn == false) {
			// // // // console.log('ntm')
			router.push("/");
			return ;
		}
		if (store.state.user.username == username) {
			router.push("/profile");
			return ;
		}
		// if (this.user == null) {
		// 	router.push('/profile')
		// }
	}


	async created() {
		if (store.state.isLoggedIn == false) {
			// // // // console.log('ntm')
			router.push("/");
			return ;
		}
		const route = useRoute();
		const username = route.params.username;

		this.user =  await store.dispatch('getUserByUname', username).then((u: any) => u)
		if (!this.user)
			router.push('/profile')
		// // // // console.log('ici')
		// // // // console.log("this:", this.user.avatarId)
		// if (this.user.avatarId !== null) {
		// 	const test = ref(null);
		// 	test.value = await store.dispatch('getAvatarByUname', 3).then((a: any) => a)
		// 	// // // console.log('test', test);
		// 	this.image.img = test
		// }
		if (this.user) { // user exist
			// // // // console.log('user exist')
			if (this.user.avatarId != null) {
				// // // // console.log('user avatarid exit')
				store.dispatch('getAvatarByUname', this.user.avatarId)
				// if (store.state.avatarProfile) {
				// 	// // // console.log('avatar profile existe');
				// }
				// await store.dispatch('getAvatarByUname', this.user.avatarId).then((a: any) => a)
			}

		}
	}

	backHome = () => {
		router.push("/profile")
	}

	addFriend = (username:string) => {
		store.dispatch('addFriend', username);
	}

	ifIsFriend = () => {
		return store.state.friendsList.find((f:any) => f.username === this.user.username)
	}

	DisplayImage = () => {
		if (this.user.avatarId == null) {
			// // // // console.log('classique avatar');
			return this.user.avatar42;
		}
		else {
			// // // // console.log('la');
			// store.dispatch('getAvatarByUname', this.user.avatarId).then((a: any) => a)
			// // // // console.log('avatar upload')
			// // // // console.log('avatar profile = ', store.state.avatarProfile)
			return store.state.avatarProfile
		}
		// return this.image
	}


}

</script>


<style scoped>
.view-container p {
	text-align: center;
	color: bisque;
}

.view-container {
	margin-top: 77px;
	width: 50%;
	float: right;
	border: 2px solid green;
	height: 100%;
	color: bisque;
	overflow-y: scroll;
}

.block_header {
	width: 100%;
}

.block_header {
	margin: 10% 0;
}

.block_header img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 50%;
}

.block_header p {
	text-align: center;
}

.block_container {
	margin: 10%;
}

.block_container table {
	width: 100%;
}

.block_container tr {
	border: 1px solid white;
}

.list {
	list-style-type: none;
	text-align: center;
}

.button-exside {
	width: 100%;
	margin: 5px;
	border-radius: 10px;
}

.button-inside {
	width: 100%;
	border-radius: 10px;
}


</style>
