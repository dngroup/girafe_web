#!/bin/bash
echo "wait database"
while ! nc -z db 3306; do sleep 3; done
echo "database done"
java -jar session.jar 
