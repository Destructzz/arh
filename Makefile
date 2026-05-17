-include .env
export

COMPOSE_FILE ?= docker-compose.yml

.PHONY: backup-export backup-import

backup-export:
	@echo "Exporting database backup..."
	@mkdir -p backup
	docker compose -f $(COMPOSE_FILE) exec -T postgres pg_dump -c --if-exists -U $(POSTGRES_USER) -d $(POSTGRES_DB) > backup/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Backup exported successfully to backup/ folder"

backup-import:
	@if [ -z "$(FILENAME)" ]; then \
		echo "❌ Error: FILENAME is required. Example: make backup-import FILENAME=backup_20260517_184000.sql"; \
		exit 1; \
	fi
	@if [ ! -f "backup/$(FILENAME)" ]; then \
		echo "❌ Error: File backup/$(FILENAME) does not exist."; \
		exit 1; \
	fi
	@echo "Importing database backup from backup/$(FILENAME)..."
	docker compose -f $(COMPOSE_FILE) exec -T postgres psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) < backup/$(FILENAME)
	@echo "✅ Backup imported successfully from backup/$(FILENAME)"
