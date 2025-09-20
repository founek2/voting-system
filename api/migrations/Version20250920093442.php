<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250920093442 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE async_messages (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_550DF1A2FB7336F0 ON async_messages (queue_name)');
        $this->addSql('CREATE INDEX IDX_550DF1A2E3BD61CE ON async_messages (available_at)');
        $this->addSql('CREATE INDEX IDX_550DF1A216BA31DB ON async_messages (delivered_at)');
        $this->addSql('COMMENT ON COLUMN async_messages.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN async_messages.available_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN async_messages.delivered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE OR REPLACE FUNCTION notify_async_messages() RETURNS TRIGGER AS $$
            BEGIN
                PERFORM pg_notify(\'async_messages\', NEW.queue_name::text);
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;');
        $this->addSql('DROP TRIGGER IF EXISTS notify_trigger ON async_messages;');
        $this->addSql('CREATE TRIGGER notify_trigger AFTER INSERT OR UPDATE ON async_messages FOR EACH ROW EXECUTE PROCEDURE notify_async_messages();');
        $this->addSql('CREATE TABLE async_messages_failed (id BIGSERIAL NOT NULL, body TEXT NOT NULL, headers TEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, available_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, delivered_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_6D01772EFB7336F0 ON async_messages_failed (queue_name)');
        $this->addSql('CREATE INDEX IDX_6D01772EE3BD61CE ON async_messages_failed (available_at)');
        $this->addSql('CREATE INDEX IDX_6D01772E16BA31DB ON async_messages_failed (delivered_at)');
        $this->addSql('COMMENT ON COLUMN async_messages_failed.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN async_messages_failed.available_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN async_messages_failed.delivered_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE OR REPLACE FUNCTION notify_async_messages_failed() RETURNS TRIGGER AS $$
            BEGIN
                PERFORM pg_notify(\'async_messages_failed\', NEW.queue_name::text);
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;');
        $this->addSql('DROP TRIGGER IF EXISTS notify_trigger ON async_messages_failed;');
        $this->addSql('CREATE TRIGGER notify_trigger AFTER INSERT OR UPDATE ON async_messages_failed FOR EACH ROW EXECUTE PROCEDURE notify_async_messages_failed();');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE async_messages');
        $this->addSql('DROP TABLE async_messages_failed');
        $this->addSql('ALTER TABLE "user" ALTER access_token TYPE JSONB');
    }
}
