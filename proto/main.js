/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

/**
 * https://github.com/google/protobuf/releases 下载protoc
 * https://github.com/thesayyn/protoc-gen-ts
 *
 * npm install protoc-gen-ts
 * .\protoc-25.1-win64\bin\protoc.exe --ts_out=.\ts Phoenix.proto
 * .\protoc-25.1-win64\bin\protoc.exe --plugin=protoc-gen-ts=.\node_modules\.bin\protoc-gen-ts --ts_out=.\ts Phoenix.proto
 */

/**
 * proto文件转成ts文件后的异常处理
 * override
 * (data: {})  -> (_data: {})
 * 注释掉无用的
 */

const { spawn } = require("child_process"); // 异步启动子进程
const path = require("path");
const fs = require("fs");

// 配置项
const PROTOC_PATH = path.join(
	__dirname,
	"protoc-25.1-win64",
	"bin",
	"protoc.exe"
);
const PLUGIN_PATH = path.join(
	__dirname,
	"node_modules",
	".bin",
	"protoc-gen-ts"
);
const OUTPUT_DIR = path.join(__dirname, "ts");
const PROTO_FILE = "Phoenix.proto";

if (!fs.existsSync(PROTOC_PATH)) {
	console.log("protoc未找到");
	process.exit(1);
}
if (!fs.existsSync(PLUGIN_PATH)) {
	console.error("错误: protoc-gen-ts插件未找到");
	process.exit(1);
}
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true }); // 允许自动创建多级嵌套目录
}

// 构建命令参数
const args = [
	`--plugin=protoc-gen-ts=${PLUGIN_PATH}`,
	`--ts_out=${OUTPUT_DIR}`,
	PROTO_FILE,
];

// 执行命令
const proc = spawn(PROTOC_PATH, args, {
	stdio: "inherit",
	shell: true, // 确保Windows能解析路径中的斜杠
});

// 处理错误
proc.on("error", (err) => {
	console.log("执行protoc出错");
	process.exit(1);
});
// 进程退出事件
proc.on("exit", (code) => {
	if (code !== 0) {
		console.log("proc执行失败");
		process.exit(1);
	} else {
		console.log("已成功生成typescript文件到ts目录");
		process.exit(code);
	}
});
