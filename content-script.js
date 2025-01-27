(function() {
    'use strict';

    function getChannelIdFromSource() {
        fetch(location.href)
            .then(response => response.text())
            .then(html => {
                const channelIdMatch = html.match(/"channelId":"(UC[\w-]+)"/);
                if (channelIdMatch && channelIdMatch[1]) {
                    createPlaylistUrl(channelIdMatch[1]);
                } else {
                    alert("Failed to retrieve channel ID from page source.");
                }
            })
            .catch(() => {
                alert("Failed to fetch page source.");
            });
    }

    function getChannelId() {
        if (location.pathname.startsWith('/channel/')) {
            const channelUrl = location.pathname.match(/\/channel\/(UC[\w-]+)/);
            return channelUrl ? createPlaylistUrl(channelUrl[1]) : alert("Channel ID not found in URL.");
        } else if (location.pathname.startsWith('/@')) {
            getChannelIdFromSource();
        } else {
            alert("Unsupported URL format.");
        }
    }

    function createPlaylistUrl(channelId) {
        const playlistId = `UU${channelId.substring(2)}`;
        const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
        window.open(playlistUrl, "_blank");
    }

    function addButton() {
        const videosTitle = document.querySelector("#title.style-scope.ytd-shelf-renderer");
        if (!videosTitle || document.querySelector("#watchAllVideosButton")) return;

        const button = document.createElement("button");
        button.id = "watchAllVideosButton";
        button.textContent = "Watch All Videos";
        button.style.marginLeft = "10px";
        button.style.padding = "5px 10px";
        button.style.backgroundColor = "#ff0000";
        button.style.color = "#fff";
        button.style.border = "none";
        button.style.cursor = "pointer";
        button.style.borderRadius = "4px";

        button.onclick = getChannelId;
        videosTitle.parentNode.insertBefore(button, videosTitle.nextSibling);
    }

    function forceButtonReload() {
        let attempt = 0;
        const interval = setInterval(() => {
            addButton();
            attempt++;
            if (attempt >= 5) clearInterval(interval);
        }, 1000);
    }

    function observeUrlChange() {
        let lastUrl = location.href;
        const observer = new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                forceButtonReload();
            }
        });
        observer.observe(document, { subtree: true, childList: true });
        window.addEventListener('load', () => {
            forceButtonReload();
        });
    }

    observeUrlChange();
})();
