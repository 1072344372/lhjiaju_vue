import request from '../utils/request.js';
export const getRequest=(url,params)=>{
	return request({
		url:url,
		method:'GET',
		data:params
	})
	
}
export const postRequest=(url,params)=>{
	return request({
		url:url,
		method:'POST',
		data:params
	})
}