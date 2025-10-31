#!/usr/bin/env python3
"""
Unit tests for the code validator skill
"""

import unittest
import json
from main import execute, is_in_scope, is_protected, validate_typescript


class TestCodeValidator(unittest.TestCase):
    def test_is_in_scope(self):
        """Test write scope validation."""
        self.assertTrue(is_in_scope("src/app.ts", ["src/**"]))
        self.assertTrue(is_in_scope("app/page.tsx", ["app/**"]))
        self.assertFalse(is_in_scope("infra/deploy.sh", ["src/**", "app/**"]))

    def test_is_protected(self):
        """Test protected file detection."""
        self.assertTrue(is_protected(".env", [".env*"]))
        self.assertTrue(is_protected(".env.local", [".env*"]))
        self.assertTrue(is_protected("infra/deploy.sh", ["infra/**"]))
        self.assertFalse(is_protected("src/app.ts", [".env*", "infra/**"]))

    def test_validate_typescript(self):
        """Test TypeScript validation."""
        # Should warn about 'any' type
        warnings = validate_typescript("const foo: any = bar;")
        self.assertTrue(len(warnings) > 0)

        # Should warn about console.log
        warnings = validate_typescript("console.log('debug');")
        self.assertTrue(len(warnings) > 0)

        # Clean code should have no warnings
        warnings = validate_typescript("const foo: string = 'bar';")
        self.assertEqual(len(warnings), 0)

    def test_execute_valid_files(self):
        """Test validation with valid files."""
        input_data = {
            "files": [
                {
                    "path": "src/app.ts",
                    "content": "const foo: string = 'bar';",
                    "operation": "modify"
                }
            ],
            "writeScope": ["src/**"],
            "protectedFiles": [".env*"]
        }

        result = execute(input_data)
        self.assertEqual(result["status"], "success")
        self.assertTrue(result["result"]["valid"])

    def test_execute_out_of_scope(self):
        """Test validation with out-of-scope files."""
        input_data = {
            "files": [
                {
                    "path": "infra/deploy.sh",
                    "content": "#!/bin/bash",
                    "operation": "modify"
                }
            ],
            "writeScope": ["src/**"],
            "protectedFiles": []
        }

        result = execute(input_data)
        self.assertEqual(result["status"], "success")
        self.assertFalse(result["result"]["valid"])
        self.assertTrue(len(result["result"]["errors"]) > 0)

    def test_execute_protected_file(self):
        """Test validation with protected files."""
        input_data = {
            "files": [
                {
                    "path": ".env",
                    "content": "API_KEY=secret",
                    "operation": "modify"
                }
            ],
            "writeScope": ["**"],
            "protectedFiles": [".env*"]
        }

        result = execute(input_data)
        self.assertEqual(result["status"], "success")
        self.assertFalse(result["result"]["valid"])
        self.assertTrue(any("protected" in e["message"] for e in result["result"]["errors"]))


if __name__ == "__main__":
    unittest.main()
