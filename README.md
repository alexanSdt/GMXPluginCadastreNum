GMXPluginCadastreNum
====================

Плагин для проектов где требуются поле кадастрового номера от Росреестра.

1. Добавить в config:

    { pluginName: 'CadastreNum', file: 'plugins/external/GMXPluginCadastreNum/CadastreNum.js', module: 'CadastreNum', mapPlugin: true },

2. Для слоя где требуется редактирование данного поля добавить метатег:
	cadastreField = имя поля для кадастрового номера из атрибутов слоя
