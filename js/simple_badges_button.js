(function() {
	/* Local constants */
	var SHORTCODE = 'sbadge';
	var LONGNAME = 'Simple Badges';
	var AUTHOR = 'GnuFabio';
	var AUTHORURL = 'http://www.gnufabio.tk';
	var VERSION = "0.2";
	/* End of local constants */
	
	function getParentDir(url) {
		var parent = url.replace(url.split('/').pop(), '');
		return parent;
	}
	
	tinymce.create('tinymce.plugins.simplebadges', {
		init : function(ed, url) {
			ed.addButton('simplebadges', {
				title : LONGNAME,
				image : getParentDir(url) + '/images/new_button.png',
				onclick : function() {
					var TB_WIDTH = 600;
					var TB_HEIGHT = 400;
					var ID = 'simplebadges-form';
					
					tb_show(LONGNAME, '#TB_inline?width=' + TB_WIDTH + '&height=' + TB_HEIGHT + '&inlineId=' + ID);
					
					jQuery("#TB_window").animate({
						width: TB_WIDTH + 'px',
						height: TB_HEIGHT + 'px'
					});
					
				}
			});
		},
		createControl : function(n, cm) {
			return null;
		},
		getInfo : function() {
			return {
				longname : LONGNAME,
				author : AUTHOR,
				authorurl : AUTHORURL,
				version : VERSION
			};
		}
	});
	tinymce.PluginManager.add('simplebadges', tinymce.plugins.simplebadges);
	
	function isSourcesIdCorrect(hosting, id) {
		if(hosting === 'github' || hosting === 'bitbucket')  {
			var regx = /^[A-Za-z0-9\.-_]*\/[A-Za-z0-9\.-_]*$/;
			var matches = id.match(regx);
			
			if(matches == null || !matches) {
				return false;
			} else {
				return true;
			}
		} else if (hosting === 'gist') {
			var regx = /^[A-Za-z0-9\.-_]*\/[0-9]*$/;
			var matches = id.match(regx);
			
			if(matches == null || !matches) {
				return false;
			} else {
				return true;
			}
		} else if (hosting === 'sources_url') {
			return ((id.indexOf('http://') === 0) || (id.indexOf('https://') === 0) || (id.indexOf('ftp://')));
		} else if (hosting === 'pastebin') {
			var regx = /^[A-Za-z0-9]*$/;
			var regxraw = /^raw\.php\?i=[A-Za-z0-9]*$/;
			
			var matches = id.match(regx);
			var matchesraw = id.match(regxraw);
			
			return result = (!((matches == null) || !matches) || !((matchesraw == null) || !matchesraw));
		} 
		if (id === '') {
			return false;
		}
		
		return false;
	}
	
	function buildShortcode(table, options) {
		var toreturn = '[' + SHORTCODE;
		
		var sources_code = '';
		
		var sources_hosting = table.find('#simplebadges-sources-hosting').val();
		var sources_repo = table.find('#simplebadges-sources').val();
		
		if(isSourcesIdCorrect(sources_hosting, sources_repo)) {
			sources_code += ' ' + sources_hosting + '="' + sources_repo + '"';
			toreturn += sources_code;
		}
		
		for(var index in options) {
				var value = table.find('#simplebadges-' + index).val();
				
				if(!(index === 'calt')) {
				
					if((index === 'pkg') && (value === '')) {
						continue;
					} 
					toreturn += ' ' + index + '="' + value + '"';
				} else {
					toreturn += ']' + value + '[/' + SHORTCODE +']';
					return toreturn;
				}
			}
		
		//If we are here it means that 'calt' was not found! Let's build default configuration
		var defconf = '[' + SHORTCODE + '][/' + SHORTCODE + ']';
		return defconf;
	}
	
	
	jQuery(function(){
		var form = jQuery('<div id="simplebadges-form"><br/>\
			<small><i>&emsp;Please insert the application package, the sources or both</i></small><br/><br/>\
			<table id="simplebadges-table" class="form-table">\
			<tr>\
				<th><label for="simplebadges-pkg"><strong>PlayStore app package:</strong></label></th>\
				<td><input type="text" id="simplebadges-pkg" name="pkg" value="" /><br/>\
				<small><i>e.g.: com.android.chrome</i></small></td>\
			</tr>\
			<tr>\
				<th><label for="simplebadges-sources-hosting"><strong>Sources:</strong></label></th>\
				<td><select name="sources-hosting" id="simplebadges-sources-hosting">\
					<option value="github">Github</option>\
					<option value="bitbucket">Bitbucket</option>\
					<option value="gist">Gist</option>\
					<option value="pastebin">PasteBin</option>\
					<option value="sources_url">Custom URL</option>\
				</select>\
				<input type="text" id="simplebadges-sources" name="sources" value="" /><br/>\
				<small><i> Source hosting &emsp;=>&emsp; ID (eg: for Github username/repo) </i></small></td>\
			</tr>\
			<tr>\
				<th><label for="simplebadges-align"><strong>Align:</strong></label></th>\
				<td><select name="align" id="simplebadges-align">\
					<option value="center">Center</option>\
					<option value="left">Left</option>\
					<option value="right">Right</option>\
				</select></td>\
			</tr>\
			<tr>\
				<th><label for="simplebadges-size"><strong>Size:</strong></label></th>\
				<td><select name="size" id="simplebadges-size">\
					<option value="big">Big</option>\
					<option value="small">Small</option>\
				</select></td>\
			<tr>\
				<th><label for="simplebadges-calt"><strong>Badge custom alt:</strong></label></th>\
				<td><input type="text" id="simplebadges-calt" name="calt" value="Get it on Google Play Store" /></td>\
			</tr>\
		</table><br/>\
		<p class="submit">\
			&emsp;<input type="button" id="simplebadges-submit" class="button-primary" value="Insert Badge" name="submit" />\
		</p>\
		</div>');
	
		var table = form.find('table');
		form.appendTo('body').hide();
		
		form.find('#simplebadges-submit').click(function(){
			//'calt' shall always be the last value!
			var options = { 
				'pkg'    	: '',
				'align'     : 'center',
				'size'      : 'big',
				'calt'		: 'Get it on Google Play Store!',
				};
			var shortcode = buildShortcode(table, options);
			tinyMCE.activeEditor.execCommand('mceInsertContent', 0, shortcode);
			
			tb_remove();
		});
	});
})();