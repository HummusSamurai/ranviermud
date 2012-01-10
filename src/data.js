var fs   = require('fs'),
    path = require('path'),
    util = require('util'),
    Localize = require('localize');

var data_path = __dirname + '/../data/';

var Data = {
	/**
	 * load the MOTD for the intro screen
	 * @return string
	 */
	loadMotd : function ()
	{
		var motd = fs.readFileSync(data_path + 'motd').toString('utf8');
		return motd;
	},

	/**
	 * Load a player's pfile.
	 * This does not instantiate a player, it simply returns data
	 * @param string name Player's name
	 * @return object
	 */
	loadPlayer : function (name)
	{
		var playerpath = data_path + 'players/' + name + '.json';
		if (!path.existsSync(playerpath)) {
			return false;
		}

		// This currently doesn't work seemingly due to a nodejs bug so... we'll do it the hard way
		//return require(playerpath);

		return JSON.parse(fs.readFileSync(playerpath).toString('utf8'));
	},

	/**
	 * Save a player
	 * @param Player player
	 * @param function callback
	 * @return boolean
	 */
	savePlayer: function (player, callback)
	{
		fs.writeFileSync(data_path + 'players/' + player.getName() + '.json', player.stringify(), 'utf8');
		if (callback) {
			callback();
		}
	},

	/**
	 * Load and set listeners onto an object
	 * @param object config
	 * @param string l10n_dir
	 * @param object target
	 */
	loadListeners: function (config, l10n_dir, scripts_dir, target)
	{
		// Check to see if the target has scripts, if so load them
		if ('script' in config) {
			var listeners = require(scripts_dir + config.script).listeners;
			// the localization file for the script will be l10n/scripts/<script name>.yml
			// example: l10n/scripts/1.js.yml
			var l10n_file = l10n_dir + config.script + '.yml';
			var l10n = new Localize(require('js-yaml').load(require('fs').readFileSync(l10n_file).toString('utf8')), undefined, 'zz');
			util.log('Loaded script file ' + l10n_file);
			for (var listener in listeners) {
				target.on(listener, listeners[listener](l10n));
			}
		}

		return target;
	}
};

exports.Data = Data;