/*
 * English UI overlay for gcli2api.
 *
 * This file intentionally does not change API calls, event handlers, application state,
 * credential data, or backend behavior. It translates presentation text at runtime so
 * upstream updates can be applied without carrying a large fork of the UI logic.
 */
(function () {
    "use strict";

    var CJK_RE = /[\u3400-\u9fff]/;

    var EXACT = new Map([
        ["GCLI2API 控制面板", "GCLI2API Control Panel"],
        ["GCLI2API 移动端控制面板", "GCLI2API Mobile Control Panel"],
        ["GCLI2API 管理面板", "GCLI2API Admin Panel"],
        ["请输入访问密码：", "Enter the access password:"],
        ["输入密码", "Enter password"],
        ["登录", "Log in"],
        ["加载中...", "Loading..."],
        ["检查更新", "Check for updates"],
        ["退出登录", "Log out"],
        ["OAuth认证", "OAuth Authentication"],
        ["Antigravity认证", "Antigravity Authentication"],
        ["批量上传", "Batch Upload"],
        ["GCLI凭证管理", "GCLI Credentials"],
        ["Antigravity凭证管理", "Antigravity Credentials"],
        ["GCLI凭证", "GCLI Credentials"],
        ["AG凭证", "AG Credentials"],
        ["配置管理", "Configuration"],
        ["实时日志", "Live Logs"],
        ["项目信息", "Project Info"],
        ["获取认证链接", "Get Authentication Link"],
        ["认证链接：", "Authentication Link:"],
        ["点击此链接进行认证", "Click this link to authenticate"],
        ["重要说明：", "Important:"],
        ["使用说明：", "Instructions:"],
        ["适用场景：", "When to use this:"],
        ["使用步骤：", "Steps:"],
        ["从回调URL获取凭证", "Get Credentials from Callback URL"],
        ["获取认证文件", "Get Credential File"],
        ["认证文件内容：", "Credential File Contents:"],
        ["获取 Antigravity 认证链接", "Get Antigravity Authentication Link"],
        ["Antigravity 认证链接：", "Antigravity Authentication Link:"],
        ["获取 Antigravity 凭证", "Get Antigravity Credentials"],
        ["Antigravity 凭证内容：", "Antigravity Credential Contents:"],
        ["下载凭证文件", "Download Credential File"],
        ["批量上传认证文件", "Batch Upload Credential Files"],
        ["📤 GCLI 凭证批量上传", "📤 Batch Upload GCLI Credentials"],
        ["📤 Antigravity 凭证批量上传", "📤 Batch Upload Antigravity Credentials"],
        ["点击选择文件或拖拽文件到此区域", "Click to select files or drag files here"],
        ["📁 点击选择文件或拖拽文件到此区域", "📁 Click to select files or drag files here"],
        ["支持 .json 和 .zip 格式文件", "Supports .json and .zip files"],
        ["ZIP文件会自动解压提取其中的JSON凭证", "ZIP files are automatically extracted to find JSON credentials"],
        ["选择的文件：", "Selected Files:"],
        ["上传文件", "Upload Files"],
        ["清空列表", "Clear List"],
        ["上传进度：", "Upload Progress:"],
        ["GCLI凭证文件管理", "GCLI Credential Management"],
        ["Antigravity凭证文件管理", "Antigravity Credential Management"],
        ["凭证文件管理", "Credential Management"],
        ["管理所有GCLI认证文件，查看状态和执行操作", "Manage all GCLI credential files, view status, and perform actions"],
        ["管理所有Antigravity认证文件，查看状态和执行操作", "Manage all Antigravity credential files, view status, and perform actions"],
        ["管理所有认证文件，查看状态和执行操作", "Manage all credential files, view status, and perform actions"],
        ["📡 API地址（点击复制）：", "📡 API URLs (click to copy):"],
        ["OpenAI格式", "OpenAI Format"],
        ["Claude格式", "Claude Format"],
        ["Gemini格式", "Gemini Format"],
        ["点击复制", "Click to copy"],
        ["💡 检验功能说明：", "💡 Verification:"],
        ["💡 设置预览功能说明：", "💡 Preview Setup:"],
        ["总计", "Total"],
        ["正常", "Healthy"],
        ["禁用", "Disabled"],
        ["刷新状态", "Refresh Status"],
        ["打包下载所有文件", "Download All Files as ZIP"],
        ["打包下载", "Download ZIP"],
        ["批量操作", "Batch Actions"],
        ["全选", "Select All"],
        ["已选择 0 项", "0 items selected"],
        ["批量启用", "Batch Enable"],
        ["批量禁用", "Batch Disable"],
        ["批量删除", "Batch Delete"],
        ["批量检验", "Batch Verify"],
        ["批量设置预览", "Batch Set Preview"],
        ["批量开启积分", "Batch Enable Credit"],
        ["批量关闭积分", "Batch Disable Credit"],
        ["刷新所有邮箱", "Refresh All Emails"],
        ["凭证一键去重", "Deduplicate Credentials"],
        ["凭证状态：", "Credential Status:"],
        ["状态筛选：", "Status Filter:"],
        ["全部凭证", "All Credentials"],
        ["仅启用", "Enabled Only"],
        ["仅禁用", "Disabled Only"],
        ["错误码：", "Error Code:"],
        ["错误码筛选：", "Error Code Filter:"],
        ["全部", "All"],
        ["无错误", "No Errors"],
        ["冷却状态：", "Cooldown Status:"],
        ["CD中", "In Cooldown"],
        ["未CD", "Not in Cooldown"],
        ["支持", "Supported"],
        ["不支持", "Not Supported"],
        ["每页显示：", "Items per page:"],
        ["正在加载凭证文件...", "Loading credential files..."],
        ["上一页", "Previous"],
        ["下一页", "Next"],
        ["第 1 页，共 1 页", "Page 1 of 1"],
        ["管理系统配置参数，修改后立即生效", "Manage system settings; supported changes take effect immediately"],
        ["刷新配置", "Refresh Configuration"],
        ["保存配置", "Save Configuration"],
        ["正在加载配置...", "Loading configuration..."],
        ["服务器配置", "Server Configuration"],
        ["服务器主机地址:", "Server Host:"],
        ["服务器端口:", "Server Port:"],
        ["API访问密码:", "API Access Password:"],
        ["控制面板密码:", "Control Panel Password:"],
        ["通用密码:", "Shared Password:"],
        ["基础配置", "Basic Configuration"],
        ["凭证目录路径:", "Credentials Directory:"],
        ["代理设置:", "Proxy:"],
        ["端点配置", "Endpoint Configuration"],
        ["🚀 一键使用镜像网址", "🚀 Use Mirror Endpoints"],
        ["🔄 还原官方端点", "🔄 Restore Official Endpoints"],
        ["🚀 镜像网址", "🚀 Mirror Endpoints"],
        ["🔄 官方端点", "🔄 Official Endpoints"],
        ["自动封禁配置", "Auto-Ban Configuration"],
        ["启用自动封禁", "Enable Auto-Ban"],
        ["自动封禁错误码:", "Auto-Ban Error Codes:"],
        ["重试配置", "Retry Configuration"],
        ["错误重试配置", "Error Retry Configuration"],
        ["启用错误重试", "Enable Error Retry"],
        ["错误重试次数:", "Retry Count:"],
        ["错误重试间隔(秒):", "Retry Interval (seconds):"],
        ["兼容性配置", "Compatibility Configuration"],
        ["启用兼容性模式", "Enable Compatibility Mode"],
        ["返回思维链到前端", "Return Thinking Trace to Client"],
        ["Antigravity流式转非流式", "Antigravity Stream-to-Nonstream Mode"],
        ["Antigravity切换凭证", "Switch Antigravity Credentials on Retry"],
        ["抗截断配置", "Anti-Truncation Configuration"],
        ["抗截断最大重试次数:", "Max Anti-Truncation Retries:"],
        ["保活配置", "Keepalive Configuration"],
        ["保活 URL:", "Keepalive URL:"],
        ["一键设置保活", "Set Keepalive Automatically"],
        ["保活间隔 (秒):", "Keepalive Interval (seconds):"],
        ["配置热更新说明", "Hot-Reload Configuration"],
        ["实时日志", "Live Logs"],
        ["连接日志流", "Connect Log Stream"],
        ["断开连接", "Disconnect"],
        ["下载日志", "Download Logs"],
        ["清空日志", "Clear Logs"],
        ["日志级别筛选：", "Log Level Filter:"],
        ["日志级别筛选:", "Log Level Filter:"],
        ["错误", "Error"],
        ["警告", "Warning"],
        ["信息", "Info"],
        ["调试", "Debug"],
        ["自动滚动到底部", "Auto-scroll to bottom"],
        ["连接状态：", "Connection Status:"],
        ["未连接", "Disconnected"],
        ["等待连接日志流...", "Waiting for log stream connection..."],
        ["项目简介", "Project Overview"],
        ["✨ 主要功能", "✨ Key Features"],
        ["💬 交流群", "💬 Community"],
        ["📞 联系我们", "📞 Contact Us"],
        ["QQ群二维码", "QQ group QR code"],
        ["扫码加入QQ群", "Scan to join the QQ group"],
        ["项", "items"],
        ["凭证", "Credentials"],
        ["无", "None"],
        ["已启用", "Enabled"],
        ["未启用", "Not Enabled"],
        ["连接中...", "Connecting..."],
        ["已连接", "Connected"],
        ["连接断开", "Disconnected"],
        ["连接错误", "Connection Error"],
        ["连接失败", "Connection Failed"],
        ["暂无日志...", "No logs yet..."],
        ["未知版本", "Unknown Version"],
        ["版本信息获取失败", "Failed to Get Version Info"],
        ["检查中...", "Checking..."],
        ["有新版本", "Update Available"],
        ["已是最新", "Up to Date"]
    ]);

    var REPLACEMENTS = [
        ["系统现在会在认证成功后自动为您的项目启用必需的API服务", "The system will automatically enable the required API services for your project after successful authentication"],
        ["无需手动启用API，系统会自动处理这些配置步骤，让认证流程更加顺畅。", "No manual API setup is required. The system handles these configuration steps automatically for a smoother authentication flow."],
        ["✨ 自动化优化：", "✨ Automation:"],
        ["说明：", "Note:"],
        ["📁 高级选项：Google Cloud Project ID", "📁 Advanced Option: Google Cloud Project ID"],
        ["(不用管，直接点击获取链接即可)", "(You can leave this alone and simply click Get Authentication Link)"],
        ["Project ID (可选):", "Project ID (optional):"],
        ["留空将尝试自动检测，或手动输入项目ID", "Leave blank to auto-detect, or enter the project ID manually"],
        ["💡 提示：如果你不懂这是什么，可以留空此字段让系统自动检测项目ID", "💡 Tip: If you are not sure what this is, leave it blank and the system will auto-detect the project ID"],
        ["点击上方认证链接，会在新窗口中打开Google OAuth页面", "Click the authentication link above to open Google OAuth in a new window"],
        ["点击上方认证链接，在新窗口中完成 Google 授权", "Click the authentication link above and complete Google authorization in the new window"],
        ["点击上方认证链接，完成Google授权", "Click the authentication link above and complete Google authorization"],
        ["完成Google账号登录和授权", "Sign in to your Google account and authorize access"],
        ["授权成功后会跳转到localhost:11451显示成功页面", "After authorization, you will be redirected to localhost:11451 and see a success page"],
        ["授权成功后会跳转到 localhost 显示成功页面", "After authorization, you will be redirected to localhost and see a success page"],
        ["关闭OAuth窗口，返回本页面", "Close the OAuth window and return to this page"],
        ["关闭 OAuth 窗口，返回本页面", "Close the OAuth window and return to this page"],
        ["点击下方\"获取认证文件\"按钮完成流程", "Click the Get Credential File button below to finish"],
        ["点击下方\"获取凭证\"按钮完成流程", "Click the Get Credentials button below to finish"],
        ["🚀 无法回源？试试快捷方式", "🚀 Callback not reaching this server? Try the quick method"],
        ["云服务器、VPS等非本地环境", "Cloud servers, VPSs, and other remote environments"],
        ["防火墙阻止了11451端口访问", "A firewall blocks access to port 11451"],
        ["网络环境无法正常回源到localhost", "Your network cannot route the callback to localhost"],
        ["Docker容器内运行，端口映射问题", "Running in Docker with port-mapping issues"],
        ["🔍 什么是回调URL？", "🔍 What is a callback URL?"],
        ["完成Google OAuth授权后，浏览器地址栏显示的完整URL，通常看起来像这样：", "After Google OAuth authorization, copy the full URL shown in the browser address bar. It usually looks like this:"],
        ["授权成功后，复制浏览器地址栏的", "After authorization, copy the "],
        ["完整URL", "full URL"],
        ["粘贴到下方输入框，点击获取凭证即可", "Paste it into the field below and click Get Credentials"],
        ["粘贴完整的回调URL，例如：", "Paste the full callback URL, for example: "],
        ["获取谷歌Antigravity 凭证", "Get Google Antigravity credentials"],
        ["支持批量上传 GCLI 和 Antigravity 认证文件", "Supports batch upload of GCLI and Antigravity credential files"],
        ["📤 批量上传", "📤 Batch Upload"],
        ["Antigravity 凭证文件", "Antigravity credential files"],
        ["点击每个凭证的\"检验\"按钮可以重新获取Project ID, 并查看账号的tier(free/pro/ultra)。", "Click Verify on a credential to refresh its Project ID and view the account tier (free/pro/ultra)."],
        ["✅ 检验成功可以恢复403错误", "✅ Successful verification can recover from 403 errors"],
        ["让凭证重新正常工作。", " and restore the credential to normal operation."],
        ["建议在遇到403错误时使用此功能。", "Use this feature when you encounter a 403 error."],
        ["点击每个凭证的\"设置预览\"按钮可以配置Preview通道。", "Click Set Preview on a credential to configure the Preview channel."],
        ["✅ 设置预览可以解决部分凭证调用preview模型时404的问题", "✅ Setting Preview can fix 404 errors for some credentials when calling preview models"],
        ["建议在调用gemini-3-pro-preview等模型遇到404错误时使用此功能。", "Use this feature if preview models such as gemini-3-pro-preview return 404 errors."],
        ["服务器监听的主机地址，0.0.0.0表示监听所有接口", "Host address the server listens on; 0.0.0.0 listens on all interfaces"],
        ["服务器监听的端口号，修改后需要重启服务器", "Port the server listens on; changing it requires a server restart"],
        ["聊天API访问密码，用于OpenAI和Gemini API端点的认证", "Password for chat API access, used to authenticate OpenAI and Gemini API endpoints"],
        ["控制面板访问密码，用于web界面登录认证", "Password used to sign in to the web control panel"],
        ["（兼容性保留）设置后将覆盖上述两个密码，留空则使用分开的密码设置", "(Compatibility option) When set, overrides both passwords above; leave blank to use separate passwords"],
        ["存储认证文件的目录路径", "Directory path used to store credential files"],
        ["例如: ", "Example: "],
        [" 或 ", " or "],
        ["HTTP/HTTPS/SOCKS5Endpoint，留空表示不使用代理", "HTTP/HTTPS/SOCKS5 endpoint; leave blank to disable the proxy"],
        ["镜像网址主要解决墙内无法访问官方端点的问题，部分地区可能无法使用", "Mirror endpoints are intended for networks that cannot reach the official endpoints; availability may vary by region"],
        ["Google Cloud Code Assist API端点地址", "Google Cloud Code Assist API endpoint"],
        ["Google OAuth2 API端点地址，用于token获取和刷新", "Google OAuth2 API endpoint used to obtain and refresh tokens"],
        ["Google APIs API端点地址，用于API服务调用", "Google APIs endpoint used for API service calls"],
        ["Google Cloud Resource Manager API端点地址，用于项目管理", "Google Cloud Resource Manager API endpoint used for project management"],
        ["Google Cloud Service Usage API端点地址，用于服务启用管理", "Google Cloud Service Usage API endpoint used to manage service enablement"],
        ["Google Antigravity API端点地址，用于反重力模式", "Google Antigravity API endpoint used for Antigravity mode"],
        ["遇到指定错误码时自动禁用凭证", "Automatically disable credentials when specified error codes occur"],
        ["用逗号分隔的错误码列表", "Comma-separated list of error codes"],
        ["遇到错误时自动重试", "Automatically retry when errors occur"],
        ["遇到错误时的最大重试次数", "Maximum number of retries after an error"],
        ["遇到错误时每两次重试间的等待时间", "Delay between retry attempts"],
        ["启用后所有system消息全部转换成user，停用system_instructions", "When enabled, all system messages are converted to user messages and system_instructions is disabled"],
        ["✓ 支持热更新", "✓ Hot-reload supported"],
        ["⚠️ 注意：", "⚠️ Note:"],
        ["该选项可能会降低模型理解能力，但是能避免流式空回的情况。", "This option may reduce model understanding, but can prevent empty streaming responses."],
        ["当遇到流式传输时模型不返回内容或返回空响应时启用此选项。", "Enable this when streaming responses return no content or are empty."],
        ["启用后，模型的思维链会在响应中返回；禁用后，思维链会被过滤掉", "When enabled, the model thinking trace is returned in the response; when disabled, it is filtered out"],
        ["💭 说明：", "💭 Note:"],
        ["某些模型（如Gemini 2.0", "Some models (such as Gemini 2.0"],
        ["Pro）支持thinking模式，会在生成回答前先输出思考过程。启用后可以看到模型的思考过程；禁用后只显示最终回答，让输出更简洁。", " Pro) support thinking mode and produce a reasoning trace before the answer. Enable this to return that trace; disable it to return only the final answer."],
        ["启用后，非流式请求将使用流式API并收集为完整响应", "When enabled, non-streaming requests use the streaming API and collect a complete response"],
        ["针对Antigravity模式的优化选项。启用后，即使客户端请求非流式响应，后端也会使用流式API获取数据并收集完整后再返回。", "Optimization for Antigravity mode. When enabled, the backend uses the streaming API even for non-streaming client requests, then collects and returns the complete response."],
        ["某些情况下流式API比非流式API更稳定，启用此选项可以提高响应质量。", "In some cases the streaming API is more stable than the non-streaming API; enabling this may improve response reliability."],
        ["默认：", "Default:"],
        ["已启用", "Enabled"],
        ["启用后重试时切换凭证；禁用时保持当前凭证，直到该凭证对当前模型进入CD或被禁用", "When enabled, retries switch credentials; when disabled, the current credential is kept until it enters cooldown for the current model or is disabled"],
        ["✅ 说明：", "✅ Note:"],
        ["默认关闭，便于连续使用同一凭证；当发生模型CD或自动禁用时仍会切换。", "Disabled by default to keep using the same credential continuously; switching still occurs when the model enters cooldown or the credential is auto-disabled."],
        ["当检测到输出截断时的最大续传尝试次数", "Maximum continuation attempts when truncated output is detected"],
        ["注意：", "Note:"],
        ["抗截断功能现在通过模型名控制：", "Anti-truncation is now controlled by the model name:"],
        ["选择带有 \"抗截断/\" 前缀的模型即可启用", "Select a model with the \"anti-truncation/\" prefix to enable it"],
        ["流式和非流式请求均有效", "Works for both streaming and non-streaming requests"],
        ["例如: \"抗截断/gemini-2.5-pro\"", "Example: \"anti-truncation/gemini-2.5-pro\""],
        ["留空则不启用，例如: ", "Leave blank to disable, for example: "],
        ["配置后服务会定期向该 URL 发送 GET 请求以保持在线；留空则禁用保活", "When configured, the service periodically sends GET requests to this URL to stay online; leave blank to disable keepalive"],
        ["两次保活请求之间的等待时间，范围 5 - 86400 秒，默认 60", "Delay between keepalive requests, range 5-86400 seconds, default 60"],
        ["🔥 热更新配置（立即生效）：", "🔥 Hot-reload settings (take effect immediately):"],
        ["🔄 需要重启的配置：", "🔄 Settings that require a restart:"],
        ["网络配置：", "Network:"],
        ["代理设置、端点配置、HTTP超时时间、最大连接数", "proxy, endpoints, HTTP timeout, maximum connections"],
        ["代理、端点配置、超时、连接数", "proxy, endpoints, timeout, connection count"],
        ["API配置：", "API:"],
        ["凭证轮换次数、错误重试设置、自动封禁配置", "credential rotation count, retry settings, auto-ban settings"],
        ["轮换次数、重试设置、自动封禁", "rotation count, retry settings, auto-ban"],
        ["密码配置：", "Passwords:"],
        ["API密码、控制面板密码、通用密码", "API password, control panel password, shared password"],
        ["API密码、面板密码", "API password, panel password"],
        ["功能配置：", "Features:"],
        ["抗截断最大重试次数", "maximum anti-truncation retries"],
        ["抗截断重试次数", "anti-truncation retry count"],
        ["主机地址、端口号", "host address and port"],
        ["目录配置：", "Directories:"],
        ["凭证目录路径、Code Assist端点", "credentials directory and Code Assist endpoint"],
        ["文件路径：", "File paths:"],
        ["凭证目录", "credentials directory"],
        ["查看系统实时日志输出，支持日志筛选和自动滚动", "View live system logs with filtering and automatic scrolling"],
        ["关于GCLI2API项目的详细信息和支持方式", "Detailed information about the GCLI2API project and support options"],
        ["关于GCLI2API项目的详细信息", "Detailed information about the GCLI2API project"],
        ["GCLI2API是一个将Google Gemini API转换为OpenAI 和GEMINI API格式的代理工具，支持多账户管理、自动轮换、实时日志监控等功能。", "GCLI2API is a proxy that converts the Google Gemini API to OpenAI and Gemini-compatible formats, with multi-account management, automatic rotation, live log monitoring, and more."],
        ["🔗 项目地址：", "🔗 Project:"],
        ["⚠️ 使用声明：", "⚠️ Usage Notice:"],
        ["禁止商业用途和倒卖 - 仅供学习使用", "Commercial use and resale are prohibited - for learning purposes only"],
        ["🔄 多账户管理：", "🔄 Multi-account Management:"],
        ["支持批量上传和管理多个Google账户", "Batch upload and manage multiple Google accounts"],
        ["⚡ 自动轮换：", "⚡ Automatic Rotation:"],
        ["智能轮换账户，避免单账户限额", "Intelligently rotate accounts to avoid single-account limits"],
        ["📊 实时监控：", "📊 Live Monitoring:"],
        ["使用统计、错误监控、实时日志", "usage statistics, error monitoring, and live logs"],
        ["🛡️ 安全可靠：", "🛡️ Security:"],
        ["OAuth2认证、自动封禁异常账户", "OAuth2 authentication and automatic disabling of problematic accounts"],
        ["🎛️ 配置灵活：", "🎛️ Flexible Configuration:"],
        ["支持热更新配置、代理设置", "hot-reloadable settings and proxy configuration"],
        ["📱 界面友好：", "📱 Responsive UI:"],
        ["响应式设计、移动端适配", "responsive design and mobile support"],
        ["欢迎加入 QQ 群交流讨论！", "Join the QQ group for discussion!"],
        ["QQ 群号：", "QQ Group: "],
        ["• 问题反馈：", "• Bug reports:"],
        ["通过GitHub Issues提交问题和建议", "submit issues and suggestions through GitHub Issues"],
        ["• 功能请求：", "• Feature requests:"],
        ["在GitHub Discussions中讨论新功能", "discuss new features in GitHub Discussions"],
        ["• 代码贡献：", "• Code contributions:"],
        ["欢迎提交Pull Request改进项目", "Pull Requests are welcome"],
        ["• 文档完善：", "• Documentation:"],
        ["帮助改进项目文档和使用指南", "help improve project documentation and usage guides"],
        ["已加载 ", "Loaded "],
        [" 个Antigravity凭证文件", " Antigravity credential files"],
        [" 个凭证文件", " credential files"],
        ["筛选: ", "Filter: "],
        ["加载失败: ", "Load failed: "],
        ["网络错误: ", "Network error: "],
        ["未知错误", "Unknown error"],
        ["暂无凭证文件", "No credential files"],
        ["当前筛选条件下暂无数据", "No data matches the current filter"],
        ["第 ", "Page "],
        [" 页，共 ", " of "],
        [" 页", ""],
        ["显示 ", "showing "],
        ["，共 ", ", total "],
        [" 项", " items"],
        ["已选择 ", "Selected "],
        ["操作成功: ", "Operation succeeded: "],
        ["操作失败: ", "Operation failed: "],
        ["请先选择要操作的文件", "Select files before performing this action"],
        ["开启积分", "Enable Credit"],
        ["关闭积分", "Disable Credit"],
        ["确定要删除选中的 ", "Delete the selected "],
        [" 个文件吗？", " files?"],
        ["注意：此操作不可恢复！", "Warning: this action cannot be undone!"],
        ["确定要", "Are you sure you want to "],
        ["选中的 ", " the selected "],
        ["正在执行批量", "Running batch "],
        ["操作...", " operation..."],
        ["批量操作完成：成功处理 ", "Batch operation completed: successfully processed "],
        ["批量操作失败: ", "Batch operation failed: "],
        ["批量操作网络错误: ", "Batch operation network error: "],
        [" 格式不支持，只支持JSON和ZIP文件", " has an unsupported format; only JSON and ZIP files are supported"],
        ["ZIP压缩包", "ZIP archive"],
        ["JSON文件", "JSON file"],
        ["请选择要上传的文件", "Select files to upload"],
        ["正在上传并解压ZIP文件...", "Uploading and extracting ZIP files..."],
        ["成功上传 ", "Successfully uploaded "],
        ["上传失败: 服务器响应格式错误", "Upload failed: invalid server response format"],
        ["上传失败: ", "Upload failed: "],
        ["上传失败：连接中断 - 可能原因：文件过多(", "Upload failed: connection interrupted - possible causes: too many files ("],
        ["个)或网络不稳定。建议分批上传。", ") or an unstable network. Try uploading in smaller batches."],
        ["上传失败：请求超时 - 文件处理时间过长，请减少文件数量或检查网络连接", "Upload failed: request timed out - processing took too long. Reduce the number of files or check the network connection."],
        ["提示", "Notice"],
        ["点击打开链接", "Open link"],
        ["右键复制链接", "Right-click to copy link"],
        ["关闭", "Close"],
        ["已禁用", "Disabled"],
        ["错误码: ", "Error code: "],
        ["该凭证支持Preview模型", "This credential supports Preview models"],
        ["该凭证不支持Preview模型", "This credential does not support Preview models"],
        ["凭证等级: ", "Credential tier: "],
        ["当前已开启Credit模式", "Credit mode is enabled"],
        ["当前已关闭Credit模式", "Credit mode is disabled"],
        ["模型: ", "Model: "],
        ["其他模型:", "Other models:"],
        ["查看内容", "View Contents"],
        ["下载", "Download"],
        ["查看账号邮箱", "View Account Email"],
        ["查看该凭证的额度信息", "View quota information for this credential"],
        ["查看额度", "View Quota"],
        ["关闭该凭证的Credit模式", "Disable Credit mode for this credential"],
        ["开启该凭证的Credit模式", "Enable Credit mode for this credential"],
        ["配置Preview通道，启用实验性功能", "Configure the Preview channel to enable experimental features"],
        ["设置预览", "Set Preview"],
        ["重新获取Project ID，可恢复403错误", "Refresh Project ID; this can recover from 403 errors"],
        ["检验", "Verify"],
        ["测试凭证是否可用", "Test whether this credential works"],
        ["消息测试", "Message Test"],
        ["查看该凭证的详细报错信息", "View detailed errors for this credential"],
        ["查看报错", "View Errors"],
        ["未获取邮箱", "Email not fetched"],
        ["点击\"查看内容\"按钮加载文件详情...", "Click View Contents to load file details..."],
        ["点击\"查看报错\"按钮加载报错信息...", "Click View Errors to load error details..."],
        ["点击\"查看额度\"按钮加载额度信息...", "Click View Quota to load quota information..."],
        ["确定要删除", "Delete "],
        ["凭证文件吗？", " credential file?"],
        ["正在加载文件内容...", "Loading file contents..."],
        ["无法加载文件内容: ", "Unable to load file contents: "],
        ["加载文件内容失败: ", "Failed to load file contents: "],
        ["请输入密码", "Enter a password"],
        ["登录成功", "Login successful"],
        ["登录失败: ", "Login failed: "],
        ["自动登录成功", "Automatic login successful"],
        ["已退出登录", "Logged out"],
        ["正在获取认证链接...", "Getting authentication link..."],
        ["使用指定的项目ID生成认证链接...", "Generating authentication link with the specified project ID..."],
        ["将尝试自动检测项目ID，正在生成认证链接...", "Auto-detecting the project ID and generating the authentication link..."],
        ["认证链接已生成（将在认证完成后自动检测项目ID），请点击链接完成授权", "Authentication link generated. The project ID will be detected after authorization. Click the link to continue."],
        ["认证链接已生成（项目ID: ", "Authentication link generated (Project ID: "],
        ["），请点击链接完成授权", "). Click the link to continue."],
        ["获取认证链接失败", "Failed to get authentication link"],
        ["请先获取认证链接并完成授权", "Get the authentication link and complete authorization first"],
        ["等待OAuth回调中...", "Waiting for OAuth callback..."],
        ["正在等待OAuth回调，这可能需要一些时间...", "Waiting for the OAuth callback; this may take a moment..."],
        ["✅ 认证成功！项目ID已自动检测为: ", "✅ Authentication successful! Project ID auto-detected as: "],
        ["，文件已保存到: ", ", file saved to: "],
        ["✅ 认证成功！文件已保存到: ", "✅ Authentication successful! File saved to: "],
        ["请选择一个项目：", "Select a project:"],
        ["请输入序号 ", "Enter a number "],
        ["重新尝试获取认证文件", "Retry Getting Credential File"],
        ["使用选择的项目重新尝试...", "Retrying with the selected project..."],
        ["无效的选择，请重新开始认证", "Invalid selection. Restart authentication."],
        ["无法自动检测项目ID，请手动输入您的Google Cloud项目ID:", "Unable to auto-detect the project ID. Enter your Google Cloud project ID manually:"],
        ["使用手动输入的项目ID重新尝试...", "Retrying with the manually entered project ID..."],
        ["需要项目ID才能完成认证，请重新开始并输入正确的项目ID", "A project ID is required to complete authentication. Restart and enter the correct project ID."],
        ["获取认证文件失败", "Failed to get credential file"],
        ["生成认证链接中...", "Generating authentication link..."],
        ["正在生成 Antigravity 认证链接...", "Generating Antigravity authentication link..."],
        ["✅ Antigravity 认证链接已生成！请点击链接完成授权", "✅ Antigravity authentication link generated! Click the link to authorize."],
        ["生成认证链接失败", "Failed to generate authentication link"],
        ["请先获取 Antigravity 认证链接并完成授权", "Get the Antigravity authentication link and complete authorization first"],
        ["正在等待 Antigravity OAuth回调...", "Waiting for the Antigravity OAuth callback..."],
        ["✅ Antigravity 认证成功！文件已保存到: ", "✅ Antigravity authentication successful! File saved to: "],
        ["请输入回调URL", "Enter the callback URL"],
        ["请输入有效的URL（以http://或https://开头）", "Enter a valid URL starting with http:// or https://"],
        ["❌ 这不是有效的回调URL！请确保：", "❌ This is not a valid callback URL. Make sure:"],
        ["已完成Google OAuth授权", "Google OAuth authorization is complete"],
        ["复制的是浏览器地址栏的完整URL", "you copied the full URL from the browser address bar"],
        ["URL包含code和state参数", "the URL contains code and state parameters"],
        ["正在从回调URL获取凭证...", "Getting credentials from the callback URL..."],
        ["从回调URL获取凭证成功！", "Credentials obtained successfully from the callback URL!"],
        ["需要手动指定项目ID，请在高级选项中填入Google Cloud项目ID后重试", "A project ID must be specified manually. Enter the Google Cloud project ID in Advanced Options and retry."],
        ["可用项目：", "Available projects:"],
        ["检测到多个项目，请在高级选项中指定项目ID：", "Multiple projects detected. Specify the project ID in Advanced Options:"],
        ["从回调URL获取凭证失败", "Failed to get credentials from the callback URL"],
        ["❌ 这不是有效的回调URL！请确保包含code和state参数", "❌ This is not a valid callback URL. Make sure it contains code and state parameters."],
        ["正在从回调URL获取 Antigravity 凭证...", "Getting Antigravity credentials from the callback URL..."],
        ["从回调URL获取 Antigravity 凭证成功！", "Antigravity credentials obtained successfully from the callback URL!"],
        ["从回调URL获取 Antigravity 凭证失败", "Failed to get Antigravity credentials from the callback URL"],
        ["已下载文件: ", "Downloaded file: "],
        ["下载失败: ", "Download failed: "],
        ["已下载所有凭证文件", "Downloaded all credential files"],
        ["打包下载失败: ", "ZIP download failed: "],
        ["✅ 已下载: ", "✅ Downloaded: "],
        ["✅ 所有Antigravity凭证已打包下载", "✅ All Antigravity credentials downloaded as a ZIP"],
        ["正在获取用户邮箱...", "Fetching user email..."],
        ["成功获取邮箱: ", "Email fetched: "],
        ["无法获取用户邮箱", "Unable to fetch user email"],
        ["获取邮箱失败: ", "Failed to fetch email: "],
        ["🔍 正在检验Project ID，请稍候...", "🔍 Verifying Project ID, please wait..."],
        ["🔍 正在检验Antigravity Project ID，请稍候...", "🔍 Verifying Antigravity Project ID, please wait..."],
        ["积分: ", "Credit: "],
        ["✅ 检验成功！", "✅ Verification successful!"],
        ["检验成功", "Verification Successful"],
        ["检验失败", "Verification Failed"],
        ["文件: ", "File: "],
        ["状态: ", "Status: "],
        ["🧪 正在测试凭证，请稍候...", "🧪 Testing credential, please wait..."],
        ["🧪 正在测试Antigravity凭证，请稍候...", "🧪 Testing Antigravity credential, please wait..."],
        ["✅ 测试成功！", "✅ Test successful!"],
        ["测试成功", "Test Successful"],
        ["❌ 测试失败", "❌ Test failed"],
        ["测试失败", "Test Failed"],
        ["凭证可用", "Credential is usable"],
        ["Antigravity凭证可用", "Antigravity credential is usable"],
        ["错误详情:", "Error details:"],
        ["🔧 正在配置Preview通道，请稍候...", "🔧 Configuring Preview channel, please wait..."],
        ["✅ 配置成功！", "✅ Configuration successful!"],
        ["Preview通道配置成功", "Preview Channel Configured"],
        ["配置失败", "Configuration failed"],
        ["Preview通道配置失败", "Preview Channel Configuration Failed"],
        ["失败步骤: ", "Failed step: "],
        ["配置Preview通道失败", "Failed to configure Preview channel"],
        ["📊 正在加载额度信息...", "📊 Loading quota information..."],
        ["暂无额度信息", "No quota information"],
        ["额度信息详情", "Quota Details"],
        ["剩余", "remaining "],
        ["✅ 成功加载额度信息", "✅ Quota information loaded"],
        ["获取额度信息失败", "Failed to get quota information"],
        ["⏳ 正在加载报错信息...", "⏳ Loading error information..."],
        ["无报错记录", "No error records"],
        ["该凭证运行正常", "This credential is operating normally"],
        ["无详细信息", "No details"],
        ["详细信息:", "Details:"],
        ["类型: ", "Type: "],
        ["原因: ", "Reason: "],
        ["加载失败", "Load Failed"],
        ["✅ 成功加载报错信息", "✅ Error information loaded"],
        ["获取报错信息失败", "Failed to get error information"],
        ["点击打开: ", "Open: "],
        ["❌ 请先选择要检验的凭证", "❌ Select credentials to verify first"],
        ["❌ 请先选择要检验的Antigravity凭证", "❌ Select Antigravity credentials to verify first"],
        ["确定要批量检验 ", "Batch verify "],
        [" 个凭证的Project ID吗？", " credential Project IDs?"],
        [" 个Antigravity凭证的Project ID吗？", " Antigravity credential Project IDs?"],
        ["将并行检验以加快速度。", "Verification will run in parallel for speed."],
        ["🔍 正在并行检验 ", "🔍 Verifying "],
        [" 个凭证，请稍候...", " credentials in parallel, please wait..."],
        [" 个Antigravity凭证，请稍候...", " Antigravity credentials in parallel, please wait..."],
        ["失败", "Failed"],
        ["批量检验完成！", "Batch verification complete!"],
        ["Antigravity批量检验完成！", "Antigravity batch verification complete!"],
        ["成功: ", "Succeeded: "],
        ["失败: ", "Failed: "],
        ["详细结果:", "Detailed results:"],
        ["✅ 全部检验成功！成功检验 ", "✅ All verifications succeeded! Verified "],
        ["❌ 全部检验失败！失败 ", "❌ All verifications failed! Failed "],
        ["⚠️ 批量检验完成：成功 ", "⚠️ Batch verification complete: succeeded "],
        ["批量检验完成", "Batch Verification Complete"],
        ["Antigravity批量检验完成", "Antigravity Batch Verification Complete"],
        ["❌ 请先选择要配置Preview的凭证", "❌ Select credentials to configure Preview first"],
        ["确定要为 ", "Configure Preview for "],
        [" 个凭证批量设置Preview通道吗？", " credentials?"],
        ["将并行配置以加快速度。", "Configuration will run in parallel for speed."],
        ["🔧 正在为 ", "🔧 Configuring Preview for "],
        [" 个凭证配置Preview通道，请稍候...", " credentials, please wait..."],
        ["批量配置Preview通道完成！", "Batch Preview configuration complete!"],
        ["✅ 全部配置成功！成功配置 ", "✅ All configurations succeeded! Configured "],
        [" 个凭证的Preview通道", " credential Preview channels"],
        ["❌ 全部配置失败！失败 ", "❌ All configurations failed! Failed "],
        ["⚠️ 批量配置完成：成功 ", "⚠️ Batch configuration complete: succeeded "],
        ["批量配置Preview通道完成", "Batch Preview Configuration Complete"],
        ["确定要刷新所有凭证的用户邮箱吗？这可能需要一些时间。", "Refresh user emails for all credentials? This may take some time."],
        ["确定要刷新所有Antigravity凭证的用户邮箱吗？这可能需要一些时间。", "Refresh user emails for all Antigravity credentials? This may take some time."],
        ["正在刷新所有用户邮箱...", "Refreshing all user emails..."],
        ["邮箱刷新完成：成功获取 ", "Email refresh complete: fetched "],
        [" 个邮箱地址", " email addresses"],
        ["邮箱刷新失败", "Email refresh failed"],
        ["邮箱刷新网络错误: ", "Email refresh network error: "],
        ["确定要对凭证进行凭证一键去重吗？", "Deduplicate credentials by email?"],
        ["确定要对Antigravity凭证进行凭证一键去重吗？", "Deduplicate Antigravity credentials by email?"],
        ["相同邮箱的凭证只保留一个，其他将被删除。", "Only one credential per email will be kept; the others will be deleted."],
        ["此操作不可撤销！", "This action cannot be undone!"],
        ["正在进行凭证一键去重...", "Deduplicating credentials..."],
        ["去重完成：删除 ", "Deduplication complete: deleted "],
        [" 个重复凭证，保留 ", " duplicate credentials, kept "],
        [" 个凭证（", " credentials ("],
        [" 个唯一邮箱）", " unique emails)"],
        ["去重详情：", "Deduplication details:"],
        ["邮箱: ", "Email: "],
        ["保留: ", "Kept: "],
        ["删除: ", "Deleted: "],
        ["去重失败", "Deduplication failed"],
        ["去重网络错误: ", "Deduplication network error: "],
        ["WebSocket已经连接", "WebSocket is already connected"],
        ["日志流连接成功", "Log stream connected"],
        ["日志流连接断开", "Log stream disconnected"],
        ["日志流连接错误: ", "Log stream error: "],
        ["创建WebSocket连接失败: ", "Failed to create WebSocket connection: "],
        ["日志流连接已断开", "Log stream disconnected"],
        ["日志已清空，等待新日志...", "Logs cleared. Waiting for new logs..."],
        ["日志文件下载成功: ", "Log file downloaded: "],
        ["下载日志失败: ", "Failed to download logs: "],
        ["下载日志时网络错误: ", "Network error while downloading logs: "],
        ["清空日志失败: ", "Failed to clear logs: "],
        ["清空日志时网络错误: ", "Network error while clearing logs: "],
        ["暂无", "No "],
        ["级别的日志...", " level logs..."],
        ["未找到GCLI_CREDS_*环境变量", "No GCLI_CREDS_* environment variables found"],
        [" 个文件", " files"],
        ["环境变量状态检查完成", "Environment variable status check complete"],
        ["获取环境变量状态失败: ", "Failed to get environment variable status: "],
        ["正在从环境变量导入凭证...", "Importing credentials from environment variables..."],
        ["✅ 成功导入 ", "✅ Imported "],
        ["导入失败: ", "Import failed: "],
        ["确定要清除所有从环境变量导入的凭证文件吗？", "Clear all credential files imported from environment variables?"],
        ["这将删除所有文件名以 \"env-\" 开头的认证文件。", "This will delete all credential files whose names start with \"env-\"."],
        ["正在清除环境变量凭证文件...", "Clearing environment-variable credential files..."],
        ["✅ 成功删除 ", "✅ Deleted "],
        [" 个环境变量凭证文件", " environment-variable credential files"],
        ["清除失败: ", "Clear failed: "],
        ["配置加载成功", "Configuration loaded"],
        ["加载配置失败: ", "Failed to load configuration: "],
        ["配置保存成功", "Configuration saved"],
        ["，以下配置已立即生效: ", "; these settings took effect immediately: "],
        ["⚠️ 重启提醒: ", "⚠️ Restart required: "],
        ["保存配置失败: ", "Failed to save configuration: "],
        ["确定要将所有端点配置为镜像网址吗？", "Set all endpoints to mirror URLs?"],
        ["✅ 已切换到镜像网址配置，记得点击\"保存配置\"按钮保存设置", "✅ Switched to mirror endpoints. Click Save Configuration to save the settings."],
        ["确定要将所有端点配置为官方地址吗？", "Restore all endpoints to official URLs?"],
        ["✅ 已切换到官方端点配置，记得点击\"保存配置\"按钮保存设置", "✅ Restored official endpoints. Click Save Configuration to save the settings."],
        ["认证失败，请重新登录", "Authentication failed. Please log in again."],
        [" 个文件的使用统计", " files of usage statistics"],
        ["加载使用统计失败", "Failed to load usage statistics"],
        ["暂无使用统计数据", "No usage statistics"],
        ["24小时内调用次数", "Calls in the last 24 hours"],
        ["重置统计", "Reset Stats"],
        ["确定要重置 ", "Reset usage statistics for "],
        [" 的使用统计吗？", "?"],
        ["重置失败: ", "Reset failed: "],
        ["确定要重置所有文件的使用统计吗？此操作不可恢复！", "Reset usage statistics for all files? This action cannot be undone!"],
        ["完整版本: ", "Full version: "],
        ["提交信息: ", "Commit message: "],
        ["提交时间: ", "Commit time: "],
        ["无法获取版本信息", "Unable to get version information"],
        ["获取版本信息失败:", "Failed to get version information:"],
        ["检查更新失败: ", "Update check failed: "],
        ["发现新版本！", "New version available!"],
        ["当前: ", "Current: "],
        ["最新: ", "Latest: "],
        ["更新内容: ", "Changes: "],
        ["已是最新版本！", "You are already on the latest version!"],
        ["无法确定是否有更新", "Unable to determine whether an update is available"],
        ["请输入密码登录", "Enter your password to log in"],
        ["🔒 环境变量锚定", "🔒 Locked by environment variable"],
        ["环境变量锚定", "Locked by environment variable"]
    ];

    REPLACEMENTS.sort(function (a, b) { return b[0].length - a[0].length; });

    function replaceTrimmed(input, replacement) {
        var start = input.search(/\S/);
        if (start < 0) return input;
        var end = input.length;
        while (end > start && /\s/.test(input.charAt(end - 1))) end -= 1;
        return input.slice(0, start) + replacement + input.slice(end);
    }

    function translateText(input) {
        if (typeof input !== "string" || !CJK_RE.test(input)) return input;

        var trimmed = input.trim();
        if (EXACT.has(trimmed)) {
            return replaceTrimmed(input, EXACT.get(trimmed));
        }

        var out = input;
        for (var i = 0; i < REPLACEMENTS.length; i += 1) {
            var pair = REPLACEMENTS[i];
            if (out.indexOf(pair[0]) !== -1) {
                out = out.split(pair[0]).join(pair[1]);
            }
        }
        return out;
    }

    function shouldSkipElement(element) {
        if (!element || element.nodeType !== 1) return false;
        if (element.closest("script, style, pre, code, textarea, #logContent")) return true;
        if (element.closest(".cred-content[data-loaded=\"true\"]")) return true;
        return false;
    }

    function translateAttributes(element) {
        if (!element || element.nodeType !== 1 || shouldSkipElement(element)) return;
        ["placeholder", "title", "aria-label", "alt"].forEach(function (name) {
            if (!element.hasAttribute(name)) return;
            var oldValue = element.getAttribute(name);
            var newValue = translateText(oldValue);
            if (newValue !== oldValue) element.setAttribute(name, newValue);
        });
        if (/^(INPUT|BUTTON)$/.test(element.tagName) && /^(button|submit|reset)$/i.test(element.type || "")) {
            var oldButtonValue = element.value;
            var newButtonValue = translateText(oldButtonValue);
            if (newButtonValue !== oldButtonValue) element.value = newButtonValue;
        }
    }

    function translateNode(node) {
        if (!node) return;

        if (node.nodeType === 3) {
            var parent = node.parentElement;
            if (!parent || shouldSkipElement(parent)) return;
            var oldText = node.nodeValue;

            // common.js uses this exact Chinese string as an internal state sentinel.
            // Keep the DOM value untouched so its comparison still works, while CSS
            // presents the English label to the user.
            if (parent.id === "checkUpdateBtn" && oldText.trim() === "检查中...") {
                parent.setAttribute("data-i18n-checking", "1");
                return;
            }
            if (parent.id === "checkUpdateBtn") {
                parent.removeAttribute("data-i18n-checking");
            }

            var newText = translateText(oldText);
            if (newText !== oldText) node.nodeValue = newText;
            return;
        }

        if (node.nodeType !== 1) return;
        var element = node;
        if (shouldSkipElement(element)) return;

        translateAttributes(element);

        var walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
            null
        );

        var current = walker.currentNode;
        while (current) {
            if (current.nodeType === 1) {
                translateAttributes(current);
            } else if (current.nodeType === 3) {
                var currentParent = current.parentElement;
                if (currentParent && !shouldSkipElement(currentParent)) {
                    var currentOld = current.nodeValue;
                    var currentNew = translateText(currentOld);
                    if (currentNew !== currentOld) current.nodeValue = currentNew;
                }
            }
            current = walker.nextNode();
        }
    }

    function installDialogTranslation() {
        var originalAlert = window.alert ? window.alert.bind(window) : null;
        var originalConfirm = window.confirm ? window.confirm.bind(window) : null;
        var originalPrompt = window.prompt ? window.prompt.bind(window) : null;

        if (originalAlert) {
            window.alert = function (message) {
                return originalAlert(translateText(String(message)));
            };
        }
        if (originalConfirm) {
            window.confirm = function (message) {
                return originalConfirm(translateText(String(message)));
            };
        }
        if (originalPrompt) {
            window.prompt = function (message, defaultValue) {
                return originalPrompt(translateText(String(message)), defaultValue);
            };
        }
    }

    function installCssOverrides() {
        if (document.getElementById("gcli2api-english-ui-style")) return;
        var style = document.createElement("style");
        style.id = "gcli2api-english-ui-style";
        style.textContent = [
            ".env-locked::after{content:\"🔒 Locked by environment variable\" !important;}",
            "#checkUpdateBtn[data-i18n-checking=\"1\"]{font-size:0 !important;}",
            "#checkUpdateBtn[data-i18n-checking=\"1\"]::after{content:\"Checking...\";font-size:12px;}"
        ].join("");
        document.head.appendChild(style);
    }

    function installObserver() {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === "characterData") {
                    translateNode(mutation.target);
                } else if (mutation.type === "attributes") {
                    translateAttributes(mutation.target);
                } else {
                    mutation.addedNodes.forEach(function (node) {
                        translateNode(node);
                    });
                }
            });
        });

        observer.observe(document.documentElement, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["placeholder", "title", "aria-label", "alt", "value"]
        });

        return observer;
    }

    function reportUntranslated() {
        if (!/[?&]i18n_debug=1(?:&|$)/.test(window.location.search)) return;
        var found = new Set();
        var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
        var node = walker.nextNode();
        while (node) {
            if (node.parentElement && !shouldSkipElement(node.parentElement) && CJK_RE.test(node.nodeValue || "")) {
                found.add((node.nodeValue || "").trim());
            }
            node = walker.nextNode();
        }
        if (found.size) {
            console.warn("[gcli2api i18n] Untranslated UI text:", Array.from(found));
        }
    }

    document.documentElement.lang = "en";
    installDialogTranslation();
    installCssOverrides();
    translateNode(document.documentElement);
    installObserver();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function () {
            translateNode(document.documentElement);
            setTimeout(reportUntranslated, 0);
        }, { once: true });
    } else {
        setTimeout(function () {
            translateNode(document.documentElement);
            reportUntranslated();
        }, 0);
    }

    window.GCLI2API_I18N = {
        language: "en",
        translateText: translateText,
        refresh: function () { translateNode(document.documentElement); }
    };
})();
