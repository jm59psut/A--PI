Corona.AddScriptToList = (script: CoronaModule): void => {
	if(script.isVisible === false) // I don't want to spam with !== undefined
		return
	
	var panel = $.CreatePanel("ToggleButton", Corona.Panels.MainPanel.scripts, script.name)
	panel.BLoadLayoutFromString(`<root>\
	<Panel>\
		<Label text="${script.name}"/>\
	</Panel>\
</root>`, false, false)

	Utils.InstallStyle(panel, "width: 170px")
	Utils.InstallStyle(panel.Children()[0], "font-family: Radiance; font-size: 18px; padding: 10px 5px 5px 0px; padding: 5px 1px;color: #5D5D5D")

	panel.SetPanelEvent("onactivate", () => {
		Utils.InstallStyle(panel.Children()[0], `text-shadow: 0 0 1${panel.checked ? "0px white" : "px green"}; color: ${panel.checked ? "green" : "red"}`)
		script.onToggle(panel)
	})
	Utils.MovePanelClick(Corona.Panels.MainPanel, p => {
		Corona.Configs.Menu.position = p.style.position
		Corona.SaveConfig("Menu", Corona.Configs.Menu)
	})
	Corona.GetConfig("Menu").then(config => {
		Corona.Configs.Menu = config
		Corona.Panels.MainPanel.style.position = config.position
	})
}

Corona.Panels.MainPanel.FindChildTraverse("Reload").SetPanelEvent("onactivate", Corona.ReloadCorona)
Corona.Panels.MainPanel.scripts = Corona.Panels.MainPanel.FindChildTraverse("scripts")
Utils.InstallStyle(Corona.Panels.MainPanel, "width: 250px; position: -1px 12% 0; transition-property: position; transition-duration: .26s; transition-timing-function: ease-in-out")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("ScriptsName"), "background-color: #EBEBEB; font-size: 20px; color: #5D5D5D;text-align: center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("ReloadText"), "background-color:#EBEBEB;font-size: 20px; color: #5D5D5D; width: 250px; text-align: center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("ScriptLogName"), "background-color: #EBEBEB ); font-size: 20px; color: #5D5D5D; width: 250px; text-align: center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("Reload"), "background-color: #EBEBEB; font-size: 20px; color: #5D5D5D; width: 250px; text-align: center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("scripts"),"background-color:#EBEBEB;color: #5D5D5D;height: 120px; width: 250px; overflow: squish scroll; flow-children: right-wrap; width:250px; horizontal-align: center")
//Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("QuestSlideThumb"), "vertical-align: center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("logo"), "vertical-align: center","horiontal-align:center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("top-menu"), "vertical-align: center","horiontal-align:center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("bottom-menu"), "vertical-align: center","horiontal-align:center")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("Main"), "width: 250px; flow-children: down; overflow: clip squish; padding: 0 32px 0 0")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("ScriptLog"), "width: 250px; overflow: squish scroll; background-color:#EBEBEB; font-size: 5px; color: #5D5D5D; height: 100px; flow-children: down")
Utils.InstallStyle(Corona.Panels.MainPanel.FindChildTraverse("Overlay"), "width: 250px; margin: -1px 0 0 0; flow-children: down; overflow: squish scroll; background-color:#000")
//Corona.Panels.MainPanel.FindChildTraverse("QuestSlideThumb").SetPanelEvent("onactivate", () => {
//	var panel = Corona.Panels.MainPanel
//	panel.flag = !panel.flag
//	Utils.InstallStyle(panel, `position: ${panel.flag ? -1 : 200}px 100 0; vertical-align: center; transition-property: position, blur; transition-duration: .26s; transition-timing-function: ease-in-out`)
//	Utils.InstallStyle(panel.FindChildTraverse("Main"), `blur: gaussian(${panel.flag ? 0 : 3})`)
//})
//Utils.InstallStyle(Corona.Panels.MainPanel, `position: 200px 100px 0; vertical-align: center; transition-property: position, blur; transition-duration: .26s; transition-timing-function: ease-in-out`)