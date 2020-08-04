const commander = require('commander');
const program = new commander.Command();

program.version("0.0.1")
	.option("--verbose", "verbose mode", false);

// source command and subcommands
const source = new commander.Command('source');
source.command('add <filepath>')
	.description("add a new source file to the corby wordlist")
	.option("--filename <name>", "file reference name (defaults to actual filename)")
	.option("--type <filetype>", "file type (defaults to `text`)", "text")
	.option("--format <value>", "file format (options: `credentials`, `wordlist`)", "wordlist")
	.option("--url <url>", "file source url (optional)")
	.action((filePath, cmdOpts) => {
		let args = {
			command: "source-add",
			filePath: filePath,
			fileType: cmdOpts.type,
			format: cmdOpts.format
		};
		args.fileName = (cmdOpts['filename']) ? cmdOpts.filename : null;
		args.url = (cmdOpts['url']) ? cmdOpts.url : null;
		args.verbose = program.opts().verbose;
		const cmd = require("./lib/source-add.js");
		cmd(args);
	});
program.addCommand(source);

// build command
program.command('build')
	.description('outputs a new wordlist from the corby database')
	.option("-o, --output <path>", "output file")
	.option("--min-length <len>", "minimum password length")
	.option("--max-length <len>", "maximum password length")
	.option("--min-strength <num>", "minimum password strength")
	.option("--include-tags <tags...>", "tags to include in output")
	.option("--exclude-tags <tags...>", "tags to exclude from output")
	.action((cmdOpts) => {
		//TODO
	});

module.exports = program;