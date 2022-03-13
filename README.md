<code>sudo docker build . -t ijob-ijob-webscrapper</code>
<code>sudo docker run -p 3000:3000 --network="host" ijob-ijob-webscrapper:latest</code>
<code>
sudo docker run -p 3000:3000 --network="host" --privileged  ijob-ijob-webscrapper:latest
</code>