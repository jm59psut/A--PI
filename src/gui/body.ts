Fusion.AddScriptToList = (script: FusionModule): void => {
	if(script.isVisible === false) // I don't want to spam with !== undefined
		return
	
	var panel = $.CreatePanel("ToggleButton", Fusion.Panels.MainPanel.scripts, script.name)
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
	Utils.MovePanelClick(Fusion.Panels.MainPanel, p => {
		Fusion.Configs.Menu.position = p.style.position
		Fusion.SaveConfig("Menu", Fusion.Configs.Menu)
	})
	Fusion.GetConfig("Menu").then(config => {
		Fusion.Configs.Menu = config
		Fusion.Panels.MainPanel.style.position = config.position
	})
}

Fusion.Panels.MainPanel.FindChildTraverse("Reload").SetPanelEvent("onactivate", Fusion.ReloadFusion)
Fusion.Panels.MainPanel.scripts = Fusion.Panels.MainPanel.FindChildTraverse("scripts")
Utils.InstallStyle(Fusion.Panels.MainPanel, "width: 250px; position: -1px 12% 0; transition-property: position; transition-duration: .26s; transition-timing-function: ease-in-out")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ScriptsName"), "background-color: #EBEBEB; font-size: 20px; color: #5D5D5D;text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ReloadText"), "background-color:#EBEBEB;font-size: 20px; color: #5D5D5D; width: 250px; text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ScriptLogName"), "background-color: #EBEBEB ); font-size: 20px; color: #5D5D5D; width: 250px; text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("Reload"), "background-color: #EBEBEB; font-size: 20px; color: #5D5D5D; width: 250px; text-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("scripts"),"background-color:#EBEBEB;color: #5D5D5D;height: 120px; width: 250px; overflow: squish scroll; flow-children: right-wrap; width:250px; horizontal-align: center")
//Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("QuestSlideThumb"), "vertical-align: center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("logo"), "vertical-align: center","horiontal-align:center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("top-menu"), "vertical-align: center","horiontal-align:center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("bottom-menu"), "vertical-align: center","horiontal-align:center")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("Main"), "width: 250px; flow-children: down; overflow: clip squish; padding: 0 32px 0 0")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("ScriptLog"), "width: 250px; overflow: squish scroll; background-color:#EBEBEB; font-size: 5px; color: #5D5D5D; height: 100px; flow-children: down")
Utils.InstallStyle(Fusion.Panels.MainPanel.FindChildTraverse("Overlay"), "width: 250px; margin: -1px 0 0 0; flow-children: down; overflow: squish scroll; background-color:#000")
//Fusion.Panels.MainPanel.FindChildTraverse("QuestSlideThumb").SetPanelEvent("onactivate", () => {
//	var panel = Fusion.Panels.MainPanel
//	panel.flag = !panel.flag
//	Utils.InstallStyle(panel, `position: ${panel.flag ? -1 : 200}px 100 0; vertical-align: center; transition-property: position, blur; transition-duration: .26s; transition-timing-function: ease-in-out`)
//	Utils.InstallStyle(panel.FindChildTraverse("Main"), `blur: gaussian(${panel.flag ? 0 : 3})`)
//})
//Utils.InstallStyle(Fusion.Panels.MainPanel, `position: 200px 100px 0; vertical-align: center; transition-property: position, blur; transition-duration: .26s; transition-timing-function: ease-in-out`)