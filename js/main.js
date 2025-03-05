// 获取基础路径
function getBasePath() {
    // 先尝试从base标签获取
    const baseElement = document.querySelector('base');
    if (baseElement) {
        return baseElement.getAttribute('href') || '';
    }
    
    // 如果没有base标签，尝试从当前URL推断
    const pathSegments = window.location.pathname.split('/');
    if (pathSegments.includes('livlog')) {
        // 找到livlog在路径中的位置，构建基础路径
        const livlogIndex = pathSegments.indexOf('livlog');
        return '/' + pathSegments.slice(1, livlogIndex + 1).join('/') + '/';
    }
    
    // 默认返回空字符串（当前路径）
    return '';
}

// 定义所有组件文件
const components = [
    'todo.html',
    'calendar.html',
    'create-task.html',
    'task-detail.html',
    'transfer-task.html',
    'statistics.html',
    'profile.html',
    'loading.html'
];

// 容器元素
const container = document.getElementById('prototype-container');

// 检测是否是file://协议
const isFileProtocol = window.location.protocol === 'file:';

// 加载所有组件
function loadComponents() {
    if (isFileProtocol) {
        // 如果是file://协议，显示特殊提示
        showFileProtocolMessage();
    } else {
        // 清空加载消息
        container.innerHTML = '';
        
        // 获取基础路径
        const basePath = getBasePath();
        
        // 首先显示加载组件
        loadComponent('loading.html', basePath);
        
        // 延迟加载其他组件，给loading一些显示时间
        setTimeout(() => {
            components.filter(c => c !== 'loading.html').forEach(component => {
                loadComponent(component, basePath);
            });
        }, 500);
    }
}

// 加载单个组件
function loadComponent(componentName, basePath = '') {
    fetch(`${basePath}components/${componentName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // 将组件添加到容器中
            container.innerHTML += html;
        })
        .catch(error => {
            console.error(`加载组件 ${componentName} 失败:`, error);
            console.error(`尝试从路径: ${basePath}components/${componentName}`);
            
            // 如果是第一次失败且是loading组件，可能是文件协议问题
            if (componentName === 'loading.html' && isFileProtocol) {
                showFileProtocolMessage();
            }
        });
}

// 显示文件协议提示信息
function showFileProtocolMessage() {
    container.innerHTML = `
        <div class="prototype" style="display: flex; justify-content: center; align-items: center; flex-direction: column; padding: 20px; text-align: center;">
            <div class="screen-title">浏览器安全限制</div>
            <div style="max-width: 500px; margin: 0 auto;">
                <h3 style="color: var(--primary);">由于浏览器安全策略，无法直接加载组件</h3>
                <p>您当前正在使用文件协议(file://)直接打开HTML文件，这会阻止JavaScript加载其他本地文件。</p>
                
                <h4 style="margin-top: 20px;">解决方法：</h4>
                <div style="text-align: left; margin-bottom: 20px;">
                    <h5>1. 使用本地服务器（推荐）</h5>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                        <p><strong>使用VS Code Live Server插件:</strong></p>
                        <p>- 安装Live Server扩展</p>
                        <p>- 右键点击index.html，选择"Open with Live Server"</p>
                    </div>
                    
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                        <p><strong>使用Python:</strong></p>
                        <p>- 打开终端，进入项目目录</p>
                        <p>- 运行: python -m http.server</p>
                        <p>- 访问: http://localhost:8000</p>
                    </div>
                    
                    <h5>2. 启动Chrome带特殊参数</h5>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                        <p><strong>Windows:</strong></p>
                        <p>创建快捷方式，在目标末尾添加: --allow-file-access-from-files</p>
                        <p><strong>Mac:</strong></p>
                        <p>open -a "Google Chrome" --args --allow-file-access-from-files</p>
                    </div>
                    
                    <h5>3. Firefox设置</h5>
                    <div style="background: #f5f5f5; padding: 10px; border-radius: 5px;">
                        <p>- 在地址栏输入: about:config</p>
                        <p>- 搜索: security.fileuri.strict_origin_policy</p>
                        <p>- 将值设为: false</p>
                    </div>
                </div>
                
                <h4>或者使用替代方案：</h4>
                <p>直接打开 <a href="app_prototypes.html" style="color: var(--primary);">app_prototypes.html</a> 文件（包含所有界面的单独文件）</p>
                
                <div style="margin-top: 20px;">
                    <button onclick="attemptReload()" class="btn" style="margin-right: 10px;">
                        <i class="fas fa-sync-alt"></i> 重试加载
                    </button>
                    <a href="app_prototypes.html" class="btn" style="text-decoration: none; background-color: var(--dark);">
                        <i class="fas fa-file"></i> 打开单文件版本
                    </a>
                </div>
            </div>
        </div>
    `;
}

// 重试加载
function attemptReload() {
    window.location.reload();
}

// 当页面加载完成时加载组件
document.addEventListener('DOMContentLoaded', loadComponents);

// 简单的导航功能 - 可以根据需要扩展
function setupNavigation() {
    // 如果是文件协议则跳过
    if (isFileProtocol) return;
    
    // 等待组件加载完成后添加导航逻辑
    setTimeout(() => {
        const navTabs = document.querySelectorAll('.nav-tab');
        
        if (navTabs.length === 0) return; // 可能组件尚未加载
        
        navTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // 找到所有相同导航栏内的标签
                const parentTabs = this.parentElement.querySelectorAll('.nav-tab');
                parentTabs.forEach(t => t.classList.remove('active'));
                
                // 为当前点击的标签添加活跃标记
                this.classList.add('active');
                
                // 此处可以添加实际导航逻辑
                // 根据点击的标签显示相应的内容区域
                const tabName = this.querySelector('span').textContent.trim();
                highlightRelatedPrototype(tabName);
            });
        });
    }, 1000); // 给组件加载预留时间
}

// 高亮显示与点击标签相关的原型界面
function highlightRelatedPrototype(tabName) {
    const prototypes = document.querySelectorAll('.prototype');
    
    prototypes.forEach(prototype => {
        // 移除所有高亮效果
        prototype.style.transform = '';
        prototype.style.boxShadow = '';
        
        // 查找与标签相关的原型
        const screenTitle = prototype.querySelector('.screen-title');
        if (screenTitle && screenTitle.textContent.toLowerCase().includes(tabName.toLowerCase())) {
            // 添加高亮效果
            prototype.style.transform = 'scale(1.03)';
            prototype.style.boxShadow = '0 15px 30px rgba(0,0,0,0.15)';
            
            // 滚动到视图
            prototype.scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    });
}

// 设置导航
document.addEventListener('DOMContentLoaded', setupNavigation);
