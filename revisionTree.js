<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Tree Structure</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <style>
        body {
            background-color: black;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            overflow: auto;
            padding: 20px;
            font-family: Arial, sans-serif;
            font-weight: bold;
        }
        .node-container {
            display: flex;
            align-items: center;
            position: relative;
        }
        .node {
            background-color: rgba(50, 50, 50, 0.9);
            padding: 15px;
            border-radius: 5px;
            margin: 10px;
            text-align: center;
            min-width: 120px;
            cursor: pointer;
            position: relative;
        }
        .menu-btn {
            background-color: rgba(30, 30, 30, 0.6);
            color: white;
            border: none;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            text-align: center;
            cursor: pointer;
            font-weight: bold;
            margin-left: 10px;
            position: absolute;
            top: 5px;
            right: -30px;
        }
        .menu {
            display: none;
            flex-direction: row;
            position: absolute;
            right: -120px;
            top: 5px;
            background: rgba(20, 20, 20, 0.9);
            padding: 5px;
            border-radius: 5px;
        }
        .btn {
            background-color: rgba(30, 30, 30, 0.6);
            color: white;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 14px;
            margin: 2px;
        }
        .btn:hover {
            background-color: rgba(255, 255, 255, 0.3);
        }
        .tree-container {
            text-align: center;
        }
        .children {
            margin-left: 20px;
            display: block;
        }
        .edit-input {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            text-align: center;
            width: 100%;
        }
        .confirmation {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    </style>
</head>
<body>
    <div id="tree-container" class="tree-container"></div>
    <script>
        let treeData = { id: 1, text: "Root Node", children: [] };

        function renderTree(data, container) {
            let nodeContainer = document.createElement("div");
            nodeContainer.classList.add("node-container");
            
            let node = document.createElement("div");
            node.classList.add("node");
            node.onclick = () => toggleChildren(data.id);
            node.innerHTML = `<span>${data.text}</span>`;
            
            let menuBtn = document.createElement("button");
            menuBtn.classList.add("menu-btn");
            menuBtn.innerText = "...";
            menuBtn.onclick = (e) => toggleMenu(e, data.id);
            
            let menu = document.createElement("div");
            menu.classList.add("menu");
            menu.id = `menu-${data.id}`;
            menu.innerHTML = `
                <button class='btn' onclick='addChild(${data.id})'>+</button>
                <button class='btn' onclick='editNode(${data.id})'>!</button>
                <button class='btn' onclick='showConfirm(${data.id})'>-</button>
                <span id='confirm-${data.id}' class='confirmation' style='display:none;'>
                    <button class='btn' onclick='removeNode(${data.id})'>Y</button>
                    <button class='btn' onclick='hideConfirm(${data.id})'>N</button>
                </span>
            `;
            
            nodeContainer.appendChild(node);
            nodeContainer.appendChild(menuBtn);
            nodeContainer.appendChild(menu);
            container.appendChild(nodeContainer);
            
            if (data.children.length > 0) {
                let childContainer = document.createElement("div");
                childContainer.classList.add("children");
                childContainer.id = `children-${data.id}`;
                container.appendChild(childContainer);
                data.children.forEach(child => renderTree(child, childContainer));
            }
        }

        function toggleChildren(parentId) {
            let childContainer = document.getElementById(`children-${parentId}`);
            if (childContainer) {
                childContainer.style.display = childContainer.style.display === "none" ? "block" : "none";
            }
        }

        function toggleMenu(event, nodeId) {
            event.stopPropagation();
            let menu = document.getElementById(`menu-${nodeId}`);
            if (menu.style.display === "flex") {
                menu.style.display = "none";
            } else {
                // Close all other menus
                document.querySelectorAll(".menu").forEach(m => m.style.display = "none");
                menu.style.display = "flex";
            }
        }

        // Close menu when clicking outside
        document.addEventListener("click", function(event) {
            if (!event.target.closest(".menu-btn") && !event.target.closest(".menu")) {
                document.querySelectorAll(".menu").forEach(m => m.style.display = "none");
            }
        });

        function addChild(parentId) {
            let parent = findNode(treeData, parentId);
            let newNode = { id: Date.now(), text: "New Node", children: [] };
            parent.children.push(newNode);
            updateTree();
            editNode(newNode.id);
        }

        function editNode(nodeId) {
            let node = findNode(treeData, nodeId);
            let nodeElement = document.querySelector(`#menu-${nodeId}`).parentElement.querySelector("span");
            nodeElement.outerHTML = `<input type='text' class='edit-input' value='${node.text}' onkeypress='checkEnter(event, ${nodeId})'>`;
            document.querySelector(".edit-input").focus();
        }

        function checkEnter(event, nodeId) {
            if (event.key === "Enter") {
                saveEdit(nodeId, event.target.value);
            }
        }

        function saveEdit(nodeId, newText) {
            let node = findNode(treeData, nodeId);
            node.text = newText;
            updateTree();
        }

        function showConfirm(nodeId) {
            document.getElementById(`confirm-${nodeId}`).style.display = "flex";
        }

        function hideConfirm(nodeId) {
            document.getElementById(`confirm-${nodeId}`).style.display = "none";
        }

        function removeNode(nodeId) {
            function recursiveRemove(node, id) {
                node.children = node.children.filter(child => child.id !== id);
                node.children.forEach(child => recursiveRemove(child, id));
            }
            recursiveRemove(treeData, nodeId);
            updateTree();
        }

        function findNode(node, id) {
            if (node.id === id) {
                return node;
            }
            for (let child of node.children) {
                let result = findNode(child, id);
                if (result) {
                    return result;
                }
            }
            return null;
        }

        function updateTree() {
            document.getElementById("tree-container").innerHTML = "";
            renderTree(treeData, document.getElementById("tree-container"));
        }

        document.addEventListener("DOMContentLoaded", function() {
            updateTree();
        });
    </script>
</body>
</html>
