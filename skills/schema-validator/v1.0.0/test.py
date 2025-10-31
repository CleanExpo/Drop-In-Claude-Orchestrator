#!/usr/bin/env python3
"""
Unit tests for the schema validator skill
"""

import unittest
import json
from main import execute, validate_type, validate_schema


class TestSchemaValidator(unittest.TestCase):
    def test_validate_type(self):
        """Test type validation."""
        self.assertTrue(validate_type("hello", "string"))
        self.assertTrue(validate_type(42, "number"))
        self.assertTrue(validate_type(42, "integer"))
        self.assertTrue(validate_type(3.14, "number"))
        self.assertTrue(validate_type(True, "boolean"))
        self.assertTrue(validate_type([], "array"))
        self.assertTrue(validate_type({}, "object"))
        self.assertFalse(validate_type("hello", "number"))

    def test_validate_simple_schema(self):
        """Test simple schema validation."""
        schema = {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "number"}
            }
        }

        # Valid data
        errors = validate_schema({"name": "John", "age": 30}, schema)
        self.assertEqual(len(errors), 0)

        # Invalid data (wrong type)
        errors = validate_schema({"name": "John", "age": "thirty"}, schema)
        self.assertTrue(len(errors) > 0)

    def test_validate_required_fields(self):
        """Test required field validation."""
        schema = {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "email": {"type": "string"}
            },
            "required": ["name", "email"]
        }

        # Valid data
        errors = validate_schema({"name": "John", "email": "john@example.com"}, schema)
        self.assertEqual(len(errors), 0)

        # Missing required field
        errors = validate_schema({"name": "John"}, schema)
        self.assertTrue(len(errors) > 0)
        self.assertTrue(any("email" in e["message"] for e in errors))

    def test_validate_array(self):
        """Test array validation."""
        schema = {
            "type": "array",
            "items": {"type": "string"},
            "minItems": 1,
            "maxItems": 3
        }

        # Valid array
        errors = validate_schema(["a", "b"], schema)
        self.assertEqual(len(errors), 0)

        # Invalid item type
        errors = validate_schema(["a", 2], schema)
        self.assertTrue(len(errors) > 0)

        # Too few items
        errors = validate_schema([], schema)
        self.assertTrue(len(errors) > 0)

        # Too many items
        errors = validate_schema(["a", "b", "c", "d"], schema)
        self.assertTrue(len(errors) > 0)

    def test_execute_valid_data(self):
        """Test execute with valid data."""
        input_data = {
            "data": {"name": "John", "age": 30},
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "number"}
                },
                "required": ["name"]
            }
        }

        result = execute(input_data)
        self.assertEqual(result["status"], "success")
        self.assertTrue(result["result"]["valid"])

    def test_execute_invalid_data(self):
        """Test execute with invalid data."""
        input_data = {
            "data": {"age": 30},  # Missing required 'name'
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "number"}
                },
                "required": ["name"]
            }
        }

        result = execute(input_data)
        self.assertEqual(result["status"], "success")
        self.assertFalse(result["result"]["valid"])
        self.assertTrue(len(result["result"]["errors"]) > 0)


if __name__ == "__main__":
    unittest.main()
