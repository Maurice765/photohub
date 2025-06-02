# photohub

Angular starten:

```bash
cd frontend
```

```bash
npm start
```
Django starten:

```bash
cd backend
```

```bash
python manage.py runserver
```

## DEV

Abhänigkeiten für Django installieren

```bash
python -m pip install -r requirements.txt
```

Schema generieren
```bash
./manage.py spectacular --color --file schema.yml
```

OpenApi Client generieren
```bash
openapi-generator-cli generate -i backend/schema.yml -g typescript-angular -o frontend/src/app/core/modules/openapi --additional-properties fileNaming=kebab-case,withInterfaces=true --generate-alias-as-model
```