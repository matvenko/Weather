import { createSlice } from '@reduxjs/toolkit'

const setAppState = () => {
	let initState = {
		mobile: false,
		darkSidebar: false,
		collapsed: false,
		theme: false,
		isLoading: false,
		optionDrawer: false,
		mobileDrawer: false,
		fullscreen: false,
		deviceViewPort: ''
	}
	let localState = window.localStorage.getItem('settings')
	return localState ? JSON.parse(localState) : initState
}

const saveToLocal = state => {
	delete state.mobile
	delete state.optionDrawer
	delete state.mobileDrawer
	localStorage.setItem('settings', JSON.stringify(state))
}

const appSlice = createSlice({
	name: 'app',
	initialState: setAppState,
	reducers: {
		setCollapsed: (state, action) => {
			const newState = { ...state, collapsed: !state.collapsed }
			saveToLocal(newState)
			return newState
		},
		setTheme: (state, action) => {
			const theme = state.theme
			let darkSidebar = state.darkSidebar
			if (!theme && darkSidebar) darkSidebar = false
			const newState = { ...state, theme: !state.theme, darkSidebar }
			saveToLocal(newState)
			return newState
		},
		setDarkSidebar: (state, action) => {
			const newState = { ...state, darkSidebar: !state.darkSidebar }
			saveToLocal(newState)
			return newState
		},
		setDeviceViewPort: (state, action) => {
			const { deviceViewPort } = action.payload
			state.deviceViewPort = deviceViewPort
		}
	}
})

export const { setCollapsed, setTheme, setDarkSidebar, setDeviceViewPort } =
	appSlice.actions

export default appSlice.reducer

export const selectCurrentCollapse = state => state.app.collapsed
export const selectCurrentTheme = state => state.app.theme
export const selectCurrentState = state => state.app
export const selectCurrentDeviceViewPort = state => state.app.deviceViewPort
