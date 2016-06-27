(function() {
    'use strict';
    var pluginName = 'CadastreNum';
    var publicInterface = {
        pluginName: pluginName,
        afterViewer: function(params, map) {
			var paramHook = function(layerName, id, parametres) {
				var latlng = parametres.event.latlng,
					layer = nsGmx.gmxMap.layersByID[layerName],
					itemProps = layer.getItemProperties(layer._gmx.dataManager.getItem(id).properties),
					meta = layer.getGmxProperties().MetaProperties,
					type = 'String',
					cadastreField = meta && meta.cadastreField && meta.cadastreField.Type === 'String' ? meta.cadastreField.Value : null;

				if (cadastreField) {
					parametres.fields.push({
						name: cadastreField, 
						view: {
							getUI: function(editDialog) {
								if (!this._input) {                            
									var span = L.DomUtil.create('span', ''),
										input = L.DomUtil.create('input', 'inputStyle edit-obj-input'),
										cadastreButton = nsGmx.Utils.makeImageButton('img/choose.png');

									input.rowName = cadastreField;
									input.rowType = type;
									input.value = itemProps[cadastreField] || '';
									input.style.width = '90%';
									input.onchange = function() {
										editDialog.set(cadastreField, input.value);
									};
									this._input = input;
									
									cadastreButton.title = 'Получить кадастровые номера';
									cadastreButton.onclick = function() {
										L.gmxUtil.getCadastreFeatures({
											latlng: latlng,
											callbackParamName: 'callback'
										}).then(function(response) {
											if (response.status === 200) {
												var trs = response.features.map(function(it, i) {
													var cn = it.attrs.cn,
														tr = _tr([_td([_t(cn)]), _td([_t(it.attrs.address || '')])], [['css', 'height', '22px'], ['class', i % 2 ? 'odd' : '']]);
													if (i % 2 === 0) {
														L.DomUtil.addClass(tr, 'odd');
													}
													tr.onclick = function() {
														input.value = cn;
														editDialog.set(cadastreField, cn);
														nsGmx.Utils.removeDialog(jDialog);
													};
													tr.style.cursor = 'pointer';
													return tr;
												});
												
												var offset = $(cadastreButton).offset(),
													div = nsGmx.Utils._div([nsGmx.Utils._table([nsGmx.Utils._tbody(trs)])]);

												L.DomUtil.addClass(div, 'cadastre-dialog');
												var jDialog = nsGmx.Utils.showDialog(_gtxt('Выбрать кадастровый объект'), div, 380, 175, offset.left + 20, offset.top - 30);
											}
										});
									}.bind(this);
									nsGmx.Utils._(span, [input, cadastreButton]);
								}
								return span;
							},
							setValue: function(value) { this._value = value; },
							getValue: function() { return this._value; },
							checkValue: function() { return true; },
							_input: null
						}
					});
				}
				return parametres;
            };

			nsGmx.EditObjectControl.addParamsHook(paramHook);
        }
    };
    gmxCore.addModule(pluginName, publicInterface, {
        css: 'CadastreNum.css'
    });
})();
