<code>sudo docker build . -t adevnamednathi/ijob-ijob-webscrapper:latest</code>
<code>sudo docker run -p 3000:3000 --network="host" --security-opt seccomp=chrome.json adevnamednathi/ijob-ijob-webscrapper:latest</code>
<code>
sudo docker run -p 3000:3000 --network="host" --privileged  ijob-ijob-webscrapper:latest
</code>